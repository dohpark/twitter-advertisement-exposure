'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Arrow from '@/public/icons/arrow.svg';
import Link from 'next/link';
import MarkdownBox from '@/components/MarkdownBox';

function Tweet() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isWrite, setIsWrite] = useState(true);
  const [content, setContent] = useState('');
  const [isTweet, setIsTweet] = useState(false);

  useEffect(() => {
    if (username.length && password.length && content.length) setIsTweet(true);
    else setIsTweet(false);
  }, [username, password, content]);

  const router = useRouter();

  const handleSetWriteFalse = () => setIsWrite(false);
  const handleSetWriteTrue = () => setIsWrite(true);
  const handleSetUserId = (e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value);
  const handleSetPassword = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
  const handleSetTweetContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value);
  const handleCreateTweet = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    await fetch('/api/feed', {
      method: 'POST',
      body: JSON.stringify({
        username,
        password,
        content,
      }),
    })
      .then((res) => {
        if (res.status === 200) router.push('/');
        return res.json();
      })
      .then((data) => alert(data.message));
  };

  return (
    <>
      <div className="flex justify-between p-3">
        <Link href="/">
          <Image src={Arrow} height={20} width={20} alt="Back to Home" className="h-full" />
        </Link>
        <button
          type="button"
          onClick={handleCreateTweet}
          disabled={!isTweet}
          className="bg-sky-500 px-3 py-1 rounded-3xl text-white text-sm active:bg-sky-600 disabled:bg-gray-300"
        >
          트윗하기
        </button>
      </div>
      <section className="max-h-full">
        <div className="flex m-3">
          <input
            type="text"
            placeholder="닉네임"
            onChange={handleSetUserId}
            value={username}
            className="border rounded-md border-gray-200 mr-3 px-2 py-1 w-1/2"
          />
          <input
            type="password"
            placeholder="비밀번호"
            onChange={handleSetPassword}
            value={password}
            className="border rounded-md border-gray-200 mr-3 px-2 py-1 w-1/2"
          />
        </div>
        <div className="flex mx-3 border-b border-gray-200">
          <button
            type="button"
            onClick={handleSetWriteTrue}
            className={`px-4 py-2 text-sm border rounded-t-md mr-2 -mb-[1px] ${
              isWrite ? 'border-gray-200 border-b-white' : 'border-transparent'
            }`}
          >
            Write
          </button>
          <button
            type="button"
            onClick={handleSetWriteFalse}
            className={`px-4 py-2 text-sm border rounded-t-md mr-2 -mb-[1px] ${
              !isWrite ? 'border-gray-200 border-b-white' : 'border-transparent'
            }`}
          >
            Preview
          </button>
        </div>
        <div className="mx-3 mb-3 border border-gray-200 border-t-0 p-2">
          {isWrite ? (
            <textarea
              placeholder="무슨 일이 일어나고 있나요?"
              className="w-full p-2 h-96"
              onChange={handleSetTweetContent}
              value={content}
            />
          ) : (
            <MarkdownBox value={content} />
          )}
        </div>
      </section>
    </>
  );
}

export default Tweet;
