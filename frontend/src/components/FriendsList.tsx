import { useState } from "react";
import Friend from "./Friend";
import FriendRequest from "./FriendRequest";
import FriendSuggestion from "./FriendSuggestion";

interface Friend {
  id: string;
  name: string;
  avatar: string;
}

interface FriendRequest {
  id: string;
  name: string;
  avatar: string;
}

interface FriendSuggestion {
  id: string;
  name: string;
  avatar: string;
}

const friendsListData: Friend[] = [
  { id: "1", name: "Joulupuki", avatar: "J" },
  { id: "2", name: "Bob Bob", avatar: "BB" },
  { id: "3", name: "PingOfPongs", avatar: "PP" },
  { id: "4", name: "David Bekham", avatar: "DB" },
];

const friendRequestData: FriendRequest[] = [
  { id: "5", name: "Pong Man", avatar: "PM" },
  { id: "6", name: "Ping Mama", avatar: "PM" },
];

const friendSuggestionData: FriendSuggestion[] = [
  { id: "7", name: "Ermi", avatar: "ER" },
  { id: "8", name: "Titi", avatar: "TT" },
  { id: "9", name: "Zula", avatar: "ZU" },
];

const FriendsList = () => {
  const [friends, setFriends] = useState<Friend[]>(friendsListData);
  const [friendRequests, setFriendRequests] =
    useState<FriendRequest[]>(friendRequestData);
  const [friendSuggestions, setFriendSuggestions] =
    useState<FriendSuggestion[]>(friendSuggestionData);

  const acceptFriendRequest = (id: string) => {
    const request = friendRequests.find((r) => r.id === id);
    if (request) {
      setFriends([...friends, request]);
      setFriendRequests(friendRequests.filter((r) => r.id !== id));
    }
  };

  const declineFriendRequest = (id: string) => {
    setFriendRequests(friendRequests.filter((r) => r.id !== id));
  };

  const removeFriend = (id: string) => {
    setFriends(friends.filter((f) => f.id !== id));
  };

  const addFriend = (id: string) => {
    setFriendSuggestions(friendSuggestions.filter((s) => s.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Friends</h1>

        {/* Friend Requests */}
        {friendRequests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Friend Requests
            </h2>
            <div className="space-y-3">
              {friendRequests.map((request: FriendRequest) => (
                <div
                  key={request.id}
                  className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between"
                >
                  <FriendRequest
                    avatar={request.avatar}
                    name={request.name}
                    onAccept={() => acceptFriendRequest(request.id)}
                    onDecline={() => declineFriendRequest(request.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Friends List */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            My Friends ({friends.length})
          </h2>
          <div className="space-y-3">
            {friends.map((friend) => (
              <div
                key={friend.id}
                className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between"
              >
                <Friend
                  avatar={friend.avatar}
                  name={friend.name}
                  onRemoveFriend={() => removeFriend(friend.id)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Suggestions */}
        {friendSuggestions.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Suggestions
            </h2>
            <div className="space-y-3">
              {friendSuggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between"
                >
                  <FriendSuggestion
                    avatar={suggestion.avatar}
                    name={suggestion.name}
                    onAddFriend={() => addFriend(suggestion.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsList;
