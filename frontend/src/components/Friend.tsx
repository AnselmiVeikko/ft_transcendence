interface FriendProps {
  name: string;
  avatar: string;
  onRemoveFriend: () => void;
}

const Friend = ({ name, avatar, onRemoveFriend }: FriendProps) => {
  return (
    <>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-medium">
          {avatar}
        </div>
        <span className="font-medium text-gray-900">{name}</span>
      </div>
      <button
        onClick={onRemoveFriend}
        className="px-4 py-2 bg-red-50 text-red-600 rounded-md text-sm hover:bg-red-100"
      >
        Remove
      </button>
    </>
  );
};

export default Friend;
