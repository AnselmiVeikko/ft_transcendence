import { useEffect, useState } from "react";
import Friend from "./Friend";
import FriendRequest from "./FriendRequest";
import FriendSuggestion from "./FriendSuggestion";
import { friendsApi } from "../utils/friendsApi";

interface Friend {
  userId: string;
  userName: string;
  friendRId: string;
  status?: 'ONLINE' | 'OFFLINE';
}

interface FriendRequest {
  userId: string;
  userName: string;
  friendRId: string;
}

interface FriendSuggestion {
  userId: string;
  userName: string;
}

type OnlineStatus = 'ALL' | 'ONLINE' | 'OFFLINE';

const FriendsList = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [friendSuggestions, setFriendSuggestions] = useState<FriendSuggestion[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<OnlineStatus>('ALL');

  const [initialLoading, setInitialLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllData = async () => {
    try {
      setInitialLoading(true);
      setError(null);

      const [friendsData, requestsData, suggestionsData] = await Promise.all([
        friendsApi.searchFriends('', 'ALL'),
        friendsApi.getPendingRequests(),
        friendsApi.getSuggestions()
      ]);

      setFriends(friendsData.data || []);
      setFriendRequests(requestsData.data || []);
      setFriendSuggestions(suggestionsData.data || []);
    } catch (error) {
      setError('Failed to load friends data. Please try again.');
      console.error('Error fetching friends data:', error);
    } finally {
      setInitialLoading(false);
    }
  }

  const searchFriends = async () => {
    try {
      setSearchLoading(true);
      const searchData = await friendsApi.searchFriends(searchQuery, statusFilter);
      setFriends(searchData.data || []);
    } catch (error) {
      console.error('Error searching friends:', error);
      setFriends([]);
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Using debounce pattern, Wait 300ms after user stops typing
  useEffect(() => {
    if (initialLoading) return;
    const delaySearch = setTimeout(() => {
      searchFriends();
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [searchQuery, statusFilter]);

  const acceptFriendRequest = async (friendRId: string) => {
    try {
      await friendsApi.acceptFriendRequest(friendRId);
      const request = friendRequests.find((r) => r.friendRId === friendRId);
      if (request) {
        setFriends([...friends, request]);
        setFriendRequests(friendRequests.filter((r) => r.friendRId !== friendRId));
      }
      searchFriends();
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const declineFriendRequest = async (friendRId: string) => {
    try {
      await friendsApi.declineFriendRequest(friendRId);
      setFriendRequests(friendRequests.filter((r) => r.friendRId !== friendRId));
    } catch (error) {
      console.error('Error declining friend request:', error);
    }
  };

  const removeFriend = async (friendRId: string) => {
    try {
      await friendsApi.removeFriend(friendRId);
      setFriends(friends.filter((f) => f.friendRId !== friendRId));
    } catch (err) {
      console.error('Error removing friend:', err);
    }
  };

  const addFriend = async (userId: string) => {
    try {
      await friendsApi.sendFriendRequest(userId);
      setFriendSuggestions(friendSuggestions.filter((s) => s.userId !== userId));
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading friends...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-2">Oops!</p>
          <p className="text-lg text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchAllData}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Friends</h1>

        {/* Search Bar */}
        <div className="mb-6 relative">
          <input
            type="text"
            placeholder="Search friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            maxLength={20}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchLoading && (
            <div className="absolute right-3 top-2.5">
              <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          )}
        </div>

        {/* Status filter Buttons online, offline, all */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-4 py-2 rounded-lg font-medium cursor-pointer transition-colors ${statusFilter === 'ALL'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter('ONLINE')}
            className={`px-4 py-2 rounded-lg font-medium cursor-pointer transition-colors ${statusFilter === 'ONLINE'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
          >
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Online
          </button>
          <button
            onClick={() => setStatusFilter('OFFLINE')}
            className={`px-4 py-2 rounded-lg font-medium cursor-pointer transition-colors ${statusFilter === 'OFFLINE'
                ? 'bg-gray-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
          >
            <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
            Offline
          </button>
        </div>

        {/* Friends List */}
        {friends.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              My Friends ({friends.length})
            </h2>
            <div className="space-y-3">
              {friends.map((friend) => (
                <div
                  key={friend.userId}
                  className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between"
                >
                  <Friend
                    avatar={friend.userName.substring(0, 2).toUpperCase()}
                    name={friend.userName}
                    onRemoveFriend={() => removeFriend(friend.friendRId)}
                    status={friend.status}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Friend Requests */}
        {friendRequests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Friend Requests
            </h2>
            <div className="space-y-3">
              {friendRequests.map((request: FriendRequest) => (
                <div
                  key={request.userId}
                  className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between"
                >
                  <FriendRequest
                    avatar={request.userName.substring(0, 2).toUpperCase()}
                    name={request.userName}
                    onAccept={() => acceptFriendRequest(request.friendRId)}
                    onDecline={() => declineFriendRequest(request.friendRId)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggestions */}
        {friendSuggestions.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Suggestions
            </h2>
            <div className="space-y-3">
              {friendSuggestions.map((suggestion) => (
                <div
                  key={suggestion.userId}
                  className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between"
                >
                  <FriendSuggestion
                    avatar={suggestion.userName.substring(0, 2).toUpperCase()}
                    name={suggestion.userName}
                    onAddFriend={() => addFriend(suggestion.userId)}
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
