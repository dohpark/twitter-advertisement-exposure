'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import Feed from '@/components/Feed';
import { useEffect, useRef } from 'react';

interface FeedItems {
  id: number;
  username: string;
  content: string;
  type: 'user' | 'advertisement';
  view: number;
  createdAt: string;
}

interface FeedListPage {
  feedList: FeedItems[];
  lastCursor: number;
}

function FeedList() {
  const getFeedLists = async (cursor: string) => {
    const data = await fetch(`/api/feedList?cursor=${cursor}`, {
      method: 'GET',
    });
    const res = await data.json();
    return res;
  };

  const fetchFeeds = (cursor: string): Promise<FeedListPage> => getFeedLists(cursor);

  const { data, isSuccess, fetchNextPage } = useInfiniteQuery({
    queryKey: ['feedList'],
    queryFn: ({ pageParam = 0 }) => fetchFeeds(pageParam),
    getNextPageParam: (lastItem) => lastItem.lastCursor,
    retry: 2,
  });

  const intersectionObserver = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) fetchNextPage();
    });

    if (intersectionObserver.current) observer.observe(intersectionObserver.current);

    return () => observer.disconnect();
  }, [intersectionObserver, fetchNextPage]);

  return (
    <main className="overflow-y-scroll grow divide-y divide-gray-200">
      {isSuccess &&
        data.pages.map((page) =>
          page.feedList.map(({ id, username, content, type, view, createdAt }) => (
            <Feed
              key={id}
              id={id}
              username={username}
              type={type}
              view={view}
              content={content}
              createdAt={createdAt}
              afterDeleteReturnHome={false}
            />
          ))
        )}
      <div ref={intersectionObserver} />
    </main>
  );
}

export default FeedList;
