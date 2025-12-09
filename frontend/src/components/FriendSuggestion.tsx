interface friendSuggestionProps {
  avatar: string;
  name: string;
  onAddFriend: () => void;
}
const FriendSuggestion = ({
  avatar,
  name,
  onAddFriend,
}: friendSuggestionProps) => {
  return (
    <>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
          {avatar}
        </div>
        <div>
          <div className="font-medium text-gray-900">{name}</div>
        </div>
      </div>
      <button
        onClick={onAddFriend}
        className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
      >
        Add
      </button>
    </>
  );
};

export default FriendSuggestion;
