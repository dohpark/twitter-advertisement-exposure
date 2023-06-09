'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';

interface DeleteFeedProps {
  closeModal: () => void;
  selectedFeedId: number;
  afterDeleteReturnHome: boolean;
}

function DeleteFeed({ closeModal, selectedFeedId, afterDeleteReturnHome }: DeleteFeedProps) {
  const [password, setPassword] = useState('');
  const [isError, setIsError] = useState(false);

  const router = useRouter();

  const handleSetPassword = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

  const deleteFeed = async () => {
    const data = await fetch('/api/feed', {
      method: 'PUT',
      body: JSON.stringify({
        id: selectedFeedId,
        password,
      }),
    }).then((res) => {
      if (res.status === 401) {
        setIsError(true);
      }
      if (!res.ok) throw Error();
      return res.json();
    });
    return data;
  };

  const queryClient = useQueryClient();
  const { mutate: handleDeleteFeed } = useMutation({
    mutationFn: () => deleteFeed(),
    onSuccess: () => {
      queryClient.invalidateQueries(['feedList']);
      queryClient.invalidateQueries(['userFeedList']);
      setIsError(false);
      closeModal();
      if (afterDeleteReturnHome) router.push('/');
    },
    onError: () => {},
  });

  const handleClickCancelDelete = () => closeModal();

  return (
    <div className="flex flex-col align-middle justify-center absolute top-1/3 w-2/3 left-[16.66%] rounded-xl p-9 z-20 bg-white">
      <div className="mb-4 text-lg text-bold">삭제할까요?</div>
      <input
        type="password"
        placeholder="비밀번호"
        onChange={handleSetPassword}
        value={password}
        className="border rounded-md border-gray-200 mr-3 px-2 py-1 mb-3"
      />
      <div className="flex flex-col">
        <button
          type="button"
          onClick={() => handleDeleteFeed()}
          className="rounded-2xl border border-gray-300 py-2 bg-red-500 text-white mb-3"
        >
          삭제
        </button>
        <button type="button" onClick={handleClickCancelDelete} className="rounded-2xl border border-gray-300 py-2">
          취소
        </button>
      </div>
      {isError && <p className="text-red-600 text-sm mt-2">비밀번호가 틀렸습니다</p>}
    </div>
  );
}

export default DeleteFeed;
