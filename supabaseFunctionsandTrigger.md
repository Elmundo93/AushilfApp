bump_last_message_at

begin
  update public.channels
  set last_message_at   = new.created_at,
      updated_at        = now(),
      last_message_text = left(new.body, 200),
      last_sender_id    = new.sender_id
  where id = new.channel_id;
  return new;
end 


ensure_1on1_channel

declare v_channel_id uuid;
begin
  -- vorhandenen 1:1-Channel finden
  select c.id into v_channel_id
  from public.channels c
  join public.channel_members ma on ma.channel_id = c.id and ma.user_id = p_user_a
  join public.channel_members mb on mb.channel_id = c.id and mb.user_id = p_user_b
  group by c.id
  having count(*) = 2
  limit 1;

  if v_channel_id is not null then
    return v_channel_id;
  end if;

  -- neuen Channel + Members anlegen (bypasst RLS durch security definer)
  insert into public.channels default values returning id into v_channel_id;

  insert into public.channel_members(channel_id, user_id, role) values
    (v_channel_id, p_user_a, 'member'),
    (v_channel_id, p_user_b, 'member');

  return v_channel_id;
end



mark_read_rpc

begin
  insert into public.message_reads(channel_id, user_id, last_read_at)
  values (p_channel_id, auth.uid(), now())
  on conflict (channel_id, user_id) do update
  set last_read_at = greatest(excluded.last_read_at, message_reads.last_read_at);
end 


fn_channel_participants_snapshot

  with m as (
    select cm.user_id,
           u.vorname, u.nachname, u.bio, u.kategorien, u."profileImageUrl"
    from channel_members cm
    join "Users" u on u.id = cm.user_id
    where cm.channel_id = p_channel_id
    order by cm.user_id
  )
  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'user_id', m.user_id,
        'vorname', m.vorname,
        'nachname', m.nachname,
        'bio', m.bio,
        'kategorien', m.kategorien,
        'profileImageUrl', m."profileImageUrl"
      )
    ), '[]'::jsonb
  )
  from m;



page_messages

  select *
  from public.messages
  where channel_id = p_channel_id
    and (
      p_before_created is null
      or (created_at, id) < (p_before_created, coalesce(p_before_id, '00000000-0000-0000-0000-000000000000'::uuid))
    )
  order by created_at desc, id desc
  limit greatest(p_limit, 1)



send_message_rpc

declare v_id uuid;
begin
  insert into public.messages (channel_id, sender_id, body, client_id, meta)
  values (p_channel_id, auth.uid(), p_body, p_client_id, p_meta)
  on conflict (client_id) do update set body = excluded.body
  returning id into v_id;
  return v_id;
end 


set_channel_updated_at

begin new.updated_at = now(); return new; end 


trg_channels_fill_meta

declare
  participants jsonb;
begin
  participants := public.fn_channel_participants_snapshot(NEW.id);
  NEW.meta := coalesce(NEW.meta, '{}'::jsonb)
              || jsonb_build_object('participants', participants);
  return NEW;
end;


trg_chm_update_channel_meta

begin
  update public.channels c
     set meta = coalesce(c.meta,'{}'::jsonb)
                || jsonb_build_object('participants', public.fn_channel_participants_snapshot(c.id)),
         updated_at = now()
   where c.id = coalesce(NEW.channel_id, OLD.channel_id);
  return null;
end;


TRIGGERS



Name:trg_channel_updated 
Table: channels
Function:set_channel_updated_at
Events:BEFORE UPDATE 
Orientation: ROW

Name:trg_channels_fill_meta_ins 
Table: channels Function:trg_channels_fill_meta 
Events:BEFORE INSERT
Orientation: ROW

Name:trg_chm_update_channel_meta 
Table:channel_members
Function:trg_chm_update_channel_meta
Events:AFTER UPDATE,AFTER DELETE, AFTER INSERT
Orientation: ROW

Name:trg_chm_update_channel_meta 
Table:channel_members
Function:trg_chm_update_channel_meta
Events:AFTER UPDATE,AFTER DELETE, AFTER INSERT
Orientation: ROW


Name:trg_messages_bump 
Table: messages 
Function:bump_last_message_at 
Events:AFTER INSERT
Orientation: ROW 
