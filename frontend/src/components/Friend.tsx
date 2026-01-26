interface FriendProps {
  name: string;
  avatar: string;
  onRemoveFriend: () => void;
  status?: 'ONLINE' | 'OFFLINE';
}

const Friend = ({ name, avatar, onRemoveFriend, status }: FriendProps) => {
  return (
    <>
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center text-white font-medium">
            {avatar}
          </div>
          <div
            role="status"
            aria-label={status === 'ONLINE' ? 'Online' : 'Offline'}
            role="status"
            aria-label={status === 'ONLINE' ? 'Online' : 'Offline'}
            className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${status === 'ONLINE' ? 'bg-green-500' : 'bg-gray-400'
              }`}
          />
        </div>
        <span className="font-medium text-gray-900">{name}</span>
      </div>
      <button
        onClick={onRemoveFriend}
        className="px-4 py-2 bg-red-50 text-red-600 rounded-md text-sm hover:bg-red-100 cursor-pointer"
      >
        Remove
      </button>
    </>
  );
};

export default Friend;
