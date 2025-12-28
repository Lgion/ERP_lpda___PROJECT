import { useUser } from '@clerk/clerk-react';

export function useAuthUser() {
  const { user, isLoaded, isSignedIn } = useUser();

  const getUserDisplayName = () => {
    if (!user) return '';
    
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    
    if (user.firstName) {
      return user.firstName;
    }
    
    if (user.emailAddresses && user.emailAddresses.length > 0) {
      return user.emailAddresses[0].emailAddress;
    }
    
    return 'Utilisateur';
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    
    if (user.firstName) {
      return user.firstName[0].toUpperCase();
    }
    
    if (user.emailAddresses && user.emailAddresses.length > 0) {
      return user.emailAddresses[0].emailAddress[0].toUpperCase();
    }
    
    return 'U';
  };

  return {
    user,
    isLoaded,
    isSignedIn,
    displayName: getUserDisplayName(),
    initials: getUserInitials(),
    email: user?.emailAddresses?.[0]?.emailAddress || '',
  };
}
