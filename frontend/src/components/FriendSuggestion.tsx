interface FriendSuggestionProps {
  avatar: string;
  name: string;
  onAddFriend: () => void;
}

const FriendSuggestion = ({
  avatar,
  name,
  onAddFriend,
}: FriendSuggestionProps) => {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium shrink-0">
          {avatar}
        </div>
        <span className="font-medium text-gray-900 truncate">{name}</span>
      </div>
      <button
        onClick={onAddFriend}
        className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 cursor-pointer shrink-0"
      >
        Add
      </button>
    </div>
  );
};

export default FriendSuggestion;
