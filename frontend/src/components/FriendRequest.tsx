interface FriendRequestProps {
  name: string;
  avatar: string;
  onAccept: () => void;
  onDecline: () => void;
}

const FriendRequest = ({
  avatar,
  name,
  onAccept,
  onDecline,
}: FriendRequestProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium shrink-0">
          {avatar}
        </div>
        <span className="font-medium text-gray-900 truncate">{name}</span>
      </div>

      <div className="flex gap-2 shrink-0 sm:ml-0 ml-[60px]">
        <button
          onClick={onAccept}
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 cursor-pointer whitespace-nowrap"
        >
          Accept
        </button>
        <button
          onClick={onDecline}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300 cursor-pointer whitespace-nowrap"
        >
          Decline
        </button>
      </div>
    </div>
  );
};

export default FriendRequest;
