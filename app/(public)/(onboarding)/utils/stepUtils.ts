export const getCurrentStep = (pathname: string): string => {
  const steps = ['intro', 'userinfo', 'userinfo2', 'intent', 'about', 'profileImage', 'password', 'conclusion', 'savety'];
  const currentStep = steps.find((step) => pathname.includes(step));
  return currentStep || 'intro';
}; 