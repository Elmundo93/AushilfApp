export interface Danksagung {
    id: string;
    writtenText: string;
    userId: string;
  created_at: string;
  profileImage: string;
  vorname: string;
  nachname: string;
  location: string;
  long: number;
  lat: number;
  userBio: string;
  authorId: string;
  }

export interface CreateDanksagungProps {
    userId: string;
    
  }
  
  export interface UseFetchDanksagungenResult {
    danksagungen: Danksagung[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
  }