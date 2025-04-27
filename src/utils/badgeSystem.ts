
import { useToast } from '@/components/ui/use-toast';
import { useUserStore } from '@/stores/userStore';

export interface Badge {
  id: string;
  name: string;
  description: string;
  image: string;
  criteria: {
    type: 'xp' | 'completedSteps' | 'roadmapCompleted';
    value: number;
    roadmapId?: string;
  };
}

// List of available badges
export const availableBadges: Badge[] = [
  {
    id: 'first-step',
    name: 'First Step',
    description: 'Completed your first learning step',
    image: '🚀',
    criteria: {
      type: 'completedSteps',
      value: 1,
    }
  },
  {
    id: 'knowledge-seeker',
    name: 'Knowledge Seeker',
    description: 'Reached 100 XP',
    image: '📚',
    criteria: {
      type: 'xp',
      value: 100,
    }
  },
  {
    id: 'dedicated-learner',
    name: 'Dedicated Learner',
    description: 'Completed 5 learning steps',
    image: '🎓',
    criteria: {
      type: 'completedSteps',
      value: 5,
    }
  },
  {
    id: 'master-student',
    name: 'Master Student',
    description: 'Reached 500 XP',
    image: '🏆',
    criteria: {
      type: 'xp',
      value: 500,
    }
  },
];

// Get total completed steps across all roadmaps
export const getTotalCompletedSteps = (progress?: Record<string, { completedSteps: string[] }>) => {
  if (!progress) return 0;
  
  return Object.values(progress).reduce((total, roadmapProgress) => {
    return total + (roadmapProgress.completedSteps?.length || 0);
  }, 0);
};

// Check if user is eligible for new badges
export const checkForNewBadges = (
  user: any,
  toast?: ReturnType<typeof useToast>['toast'],
  login?: (user: any) => void
): Badge[] => {
  if (!user) return [];

  const totalCompletedSteps = getTotalCompletedSteps(user.progress);
  const newBadges: Badge[] = [];

  availableBadges.forEach(badge => {
    // Skip if user already has this badge
    if (user.badges?.includes(badge.id)) return;
    
    let isEligible = false;
    
    if (badge.criteria.type === 'xp' && user.xp >= badge.criteria.value) {
      isEligible = true;
    } else if (badge.criteria.type === 'completedSteps' && totalCompletedSteps >= badge.criteria.value) {
      isEligible = true;
    } else if (badge.criteria.type === 'roadmapCompleted' && badge.criteria.roadmapId && 
               user.progress?.[badge.criteria.roadmapId]?.completedSteps?.length >= badge.criteria.value) {
      isEligible = true;
    }
    
    if (isEligible) {
      newBadges.push(badge);
    }
  });
  
  // Award new badges to user if login function is provided
  if (newBadges.length > 0 && login) {
    const updatedBadges = [...(user.badges || []), ...newBadges.map(badge => badge.id)];
    
    login({
      ...user,
      badges: updatedBadges
    });
    
    // Show toast notification for each new badge if toast function is provided
    if (toast) {
      newBadges.forEach(badge => {
        toast({
          title: `New Badge: ${badge.name}`,
          description: badge.description,
        });
      });
    }
  }
  
  return newBadges;
};
