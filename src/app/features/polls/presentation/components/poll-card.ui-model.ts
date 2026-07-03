import { Poll } from '@features/polls/domain/entities/poll.entity';

export interface PollCardView {
  id: string;
  title: string;
  statusText: string;
  statusBadgeClass: string;
  metaIcon: string;
  metaText: string;
  votesText: string;
  detailUrl: string[];
  leader: { text: string; percentage: number } | null;
  actionText: string;
}

export function mapPollToCardView(poll: Poll, isAuthenticated: boolean): PollCardView {
  const isClosed = poll.status === 'closed';
  const isActive = poll.status === 'active';
  const isPending = poll.status === 'pending';

  // 1. Statut et Badge (Ton existant exact)
  let statusText = 'En attente';
  let statusBadgeClass = 'bg-orange-50 text-orange-600 border border-orange-200/30';
  if (isActive) {
    statusText = 'Actif';
    statusBadgeClass = 'bg-emerald-50 text-emerald-600 border border-emerald-200/30';
  } else if (isClosed) {
    statusText = 'Clos';
    statusBadgeClass = 'bg-red-50 text-red-600 border border-red-200/30';
  }

  // 2. Dates et Icônes (Ton existant exact)
  let metaIcon = 'pi-clock'; // Par défaut
  let metaText = '';

  if (isActive) {
    const expireTime = new Date(poll.expiresAt).getTime();
    const now = Date.now();
    const daysLeft = Math.max(0, Math.ceil((expireTime - now) / (1000 * 60 * 60 * 24)));
    metaText =
      daysLeft > 0
        ? `Expire dans ${daysLeft} jour${daysLeft > 1 ? 's' : ''}`
        : "Expire aujourd'hui";
  } else if (isClosed) {
    metaText = `Clos le ${new Date(poll.expiresAt).toLocaleDateString('fr-FR')}`;
  } else if (isPending) {
    metaIcon = 'pi-calendar-clock';
    metaText = 'Démarre bientôt';
  }

  // 3. Leader (Ton existant exact)
  let leader = null;
  if (isClosed && poll.options && poll.options.length > 0) {
    const topOption = [...poll.options].sort((a, b) => b.votes - a.votes)[0];
    if (poll.totalVotes > 0) {
      leader = {
        text: topOption.text,
        percentage: Math.round((topOption.votes / poll.totalVotes) * 100),
      };
    }
  }

  return {
    id: poll.id,
    title: poll.title,
    statusText,
    statusBadgeClass,
    metaIcon,
    metaText,
    votesText: `${poll.totalVotes} vote${poll.totalVotes !== 1 ? 's' : ''}`,
    detailUrl: isAuthenticated ? ['/member', 'sondage', poll.id] : ['/sondage', poll.id],
    leader,
    actionText: isActive ? 'Voter →' : 'Voir les détails →',
  };
}
