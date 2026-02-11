import { useEffect, useState } from "react";
import Friend from "./Friend";
import FriendRequest from "./FriendRequest";
import FriendSuggestion from "./FriendSuggestion";
import { friendsApi } from "../utils/friendsApi";
import { FaSortAlphaDown, FaSortAlphaDownAlt } from "react-icons/fa";

interface Friend {
  userId: string;
  userName: string;
  friendRId: string;
  status?: 'ONLINE' | 'OFFLINE';
  avatarUrl: string;
}

interface FriendRequest {
  userId: string;
  userName: string;
  friendRId: string;
  avatarUrl: string;
}

interface FriendSuggestion {
  userId: string;
  userName: string;
  avatarUrl: string;
}

type OnlineStatus = 'ALL' | 'ONLINE' | 'OFFLINE';
type SortOrder = 'asc' | 'desc';

const FriendsList = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [friendSuggestions, setFriendSuggestions] = useState<FriendSuggestion[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<OnlineStatus>('ALL');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const [initialLoading, setInitialLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const PAGE_SIZE = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalFriends, setTotalFriends] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchAllData = async () => {
    try {
      setInitialLoading(true);
      setError(null);

      const [friendsData, requestsData, suggestionsData] = await Promise.all([
        friendsApi.searchFriends('', 'ALL', 1, PAGE_SIZE),
        friendsApi.getPendingRequests(),
        friendsApi.getSuggestions()
      ]);
      console.log('friendsData at first___', friendsData);
      console.log('friendRequestdata______', requestsData.data );

      setFriends(friendsData.data || []);
      setTotalFriends(friendsData.pagination?.totalFriend || 0);
      setTotalPages(friendsData.pagination?.totalPage || 0);
      setFriendRequests(requestsData.data || []);
      setFriendSuggestions(suggestionsData.data || []);
    } catch (error) {
      setError('Failed to load friends data. Please try again.');
      console.error('Error fetching friends data:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  
  console.log('Suggestions______', friendSuggestions );
  const searchFriends = async (page = currentPage) => {
    try {
      setSearchLoading(true);
      const searchData = await friendsApi.searchFriends(
        searchQuery,
        statusFilter,
        page,
        PAGE_SIZE
      );

      console.log('SearchData___', searchData);
      setFriends(searchData.data || []);
      setTotalFriends(searchData.pagination?.totalFriend || 0);
      setTotalPages(searchData.pagination?.totalPage || 0);
    } catch (error) {
      console.error('Error searching friends:', error);
      setFriends([]);
      setTotalFriends(0);
      setTotalPages(0);
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
    setCurrentPage(1);

    const delaySearch = setTimeout(() => {
      searchFriends(1);
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [searchQuery, statusFilter]);

  useEffect(() => {
    if (initialLoading) return;
    searchFriends(currentPage);
  }, [currentPage]);

  const acceptFriendRequest = async (friendRId: string) => {
    try {
      await friendsApi.acceptFriendRequest(friendRId);

      setFriendRequests(prevRequests =>
        prevRequests.filter((r) => r.friendRId !== friendRId)
      );
      searchFriends();
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const declineFriendRequest = async (friendRId: string) => {
    try {
      await friendsApi.declineFriendRequest(friendRId);
      setFriendRequests(prevRequests =>
        prevRequests.filter((r) => r.friendRId !== friendRId)
      );
    } catch (error) {
      console.error('Error declining friend request:', error);
    }
  };

  const removeFriend = async (friendRId: string) => {
    try {
      await friendsApi.removeFriend(friendRId);

      if (friends.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      } else {
        searchFriends();
      }
    } catch (err) {
      console.error('Error removing friend:', err);
    }
  };

  const addFriend = async (userId: string) => {
    try {
      await friendsApi.sendFriendRequest(userId);
      setFriendSuggestions(prevSuggestions =>
        prevSuggestions.filter((s) => s.userId !== userId)
      );
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

  const shouldShowPagination = totalFriends > PAGE_SIZE;

  const sortedFriends = [...friends].sort((a, b) => {
    const nameA = a.userName.toLowerCase();
    const nameB = b.userName.toLowerCase();

    if (sortOrder === 'asc') {
      return nameA.localeCompare(nameB);
    } else {
      return nameB.localeCompare(nameA);
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 sm:mb-8">Friends</h1>

        {/* Search Bar */}
        <div className="mb-4 sm:mb-6 relative">
          <input
            type="text"
            placeholder="Search friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            maxLength={20}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchLoading && (
            <div className="absolute right-3 top-2.5">
              <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          )}
        </div>

        {/* Status filter buttons and sort button */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 sm:px-4 py-2 rounded-lg font-medium cursor-pointer text-sm sm:text-base ${statusFilter === 'ALL'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter('ONLINE')}
            className={`px-3 sm:px-4 py-2 rounded-lg font-medium cursor-pointer text-sm sm:text-base ${statusFilter === 'ONLINE'
              ? 'bg-green-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 '
              }`}
          >
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Online
          </button>
          <button
            onClick={() => setStatusFilter('OFFLINE')}
            className={`px-3 sm:px-4 py-2 rounded-lg font-medium cursor-pointer text-sm sm:text-base ${statusFilter === 'OFFLINE'
              ? 'bg-gray-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 '
              }`}
          >
            <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
            Offline
          </button>

          {/* Sort */}
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-3 sm:px-4 py-2 rounded-lg bg-white border border-gray-300 text-sm sm:text-base hover:bg-gray-50 cursor-pointer flex items-center gap-1.5 font-medium text-gray-700"
          >
            <span>Sort</span>
            {sortOrder === 'asc' ? (
              <FaSortAlphaDown className="w-4 h-4" />
            ) : (
              <FaSortAlphaDownAlt className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Friends List */}
        {friends.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              My Friends ({totalFriends})
            </h2>
            <div className="space-y-3">
              {sortedFriends.map((friend) => (
                <div
                  key={friend.userId}
                  className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200"
                >
                  <Friend
                    name={friend.userName}
                    avatarUrl={friend.avatarUrl}
                    onRemoveFriend={() => removeFriend(friend.friendRId)}
                    status={friend.status}
                  />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {shouldShowPagination && (
              <div className="flex justify-center items-center gap-2 sm:gap-3 mt-6">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="px-3 py-1.5 rounded border text-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed
                   disabled:bg-gray-100 disabled:text-gray-500 disabled:border-gray-300 bg-white border-gray-300
                   text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600"

                >
                  Prev
                </button>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-3 py-1.5 rounded border text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
                   disabled:bg-gray-100 disabled:text-gray-500 disabled:border-gray-300 bg-white border-gray-300
                   text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600"
                >
                  Next
                </button>
              </div>
            )}
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
                  className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200"
                >
                  <FriendRequest
                    avatarUrl={request.avatarUrl}
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
                  className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200"
                >
                  <FriendSuggestion
                    avatarUrl={suggestion.avatarUrl}
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
