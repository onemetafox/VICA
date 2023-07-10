import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import {
  RiDiscordFill,
  RiTelegramFill,
  RiFacebookCircleFill,
  RiTwitterFill,
  RiInstagramFill,
  RiYoutubeFill,
} from 'react-icons/ri';
import { SiTiktok } from 'react-icons/si';
import logo from '../../../public/logo.png';

type Props = {
  bgColor?: string;
};
const Footer = ({ bgColor = 'bg-lightGray' }: Props) => {
  return (
    <footer
      className={`flex h-full flex-col items-center px-20 py-16 md:px-10 ${bgColor}`}
    >
      <div className="flex w-full flex-wrap justify-between">
        <div className="w-1/4 lg:hidden">
          <Link href = "/">
            <div className="flex cursor-pointer items-center">
              <Image src={logo} width={70} height={70} />
              <h1 className="ml-3 font-poppinsLarge text-2xl font-black">ViCA</h1>
            </div>
          </Link>
          <p className="mt-2 text-justify">
            Buy and sell digital currencies. Get your ViCA account to start
            accepting payments and sending money.
          </p>
        </div>
        <div className="flex flex-col sm:w-1/2">
          <h1 className="mb-3 text-lg font-bold">For you</h1>
          <Link href="/">
            <span className="mb-2 cursor-pointer text-lightBlack hover:text-blue-700">
              Buy Bitcoin
            </span>
          </Link>
          <Link href="/">
            <span className="mb-2 cursor-pointer text-lightBlack hover:text-blue-700">
              Buy Ethereum
            </span>
          </Link>
          <Link href="/">
            <span className="mb-2 cursor-pointer text-lightBlack hover:text-blue-700">
              Sell Bitcoin
            </span>
          </Link>
          <Link href="/">
            <span className="mb-2 cursor-pointer text-lightBlack hover:text-blue-700">
              Sell Ethereum
            </span>
          </Link>
          <Link href="/">
            <span className="mb-2 cursor-pointer hover:text-blue-700">
              ViCA Wallet
            </span>
          </Link>
        </div>
        <div className="flex flex-col axs:mt-5">
          <h1 className="mb-3 text-lg font-bold">About ViCA</h1>
          <Link href="/">
            <span className="mb-2 cursor-pointer text-lightBlack hover:text-blue-700">
              About us
            </span>
          </Link>
          <Link href="/terms-of-service">
            <span className="mb-2 cursor-pointer text-lightBlack hover:text-blue-700">
              Terms of service
            </span>
          </Link>
          <Link href="/privacy-policy">
            <span className="mb-2 cursor-pointer text-lightBlack hover:text-blue-700">
              Privacy policy
            </span>
          </Link>
          <Link href="/">
            <span className="mb-2 cursor-pointer text-lightBlack hover:text-blue-700">
              Announcement
            </span>
          </Link>
        </div>
        <div className="flex flex-col">
          <h1 className="mb-4 text-lg font-bold sm:mt-5">Community</h1>
          <div className="grid grid-cols-4 gap-5">
            <a href="https://google.com" target="_blank" rel="noreferrer">
              <RiDiscordFill className="h-5 w-5 text-darkBlack hover:text-blue-700" />
            </a>
            <a href="https://google.com" target="_blank" rel="noreferrer">
              <RiTelegramFill className="h-5 w-5 text-darkBlack hover:text-blue-700" />
            </a>
            <a href="https://google.com" target="_blank" rel="noreferrer">
              <RiFacebookCircleFill className="h-5 w-5 text-darkBlack hover:text-blue-700" />
            </a>
            <a href="https://google.com" target="_blank" rel="noreferrer">
              <SiTiktok className="h-5 w-5 text-darkBlack hover:text-blue-700" />
            </a>
            <a href="https://google.com" target="_blank" rel="noreferrer">
              <RiTwitterFill className="h-5 w-5 text-darkBlack hover:text-blue-700" />
            </a>
            <a href="https://google.com" target="_blank" rel="noreferrer">
              <RiInstagramFill className="h-5 w-5 text-darkBlack hover:text-blue-700" />
            </a>
            <a href="https://google.com" target="_blank" rel="noreferrer">
              <RiYoutubeFill className="h-5 w-5 text-darkBlack hover:text-blue-700" />
            </a>
          </div>
        </div>
      </div>
      <div className="mt-10 mb-10 h-[1px] w-full bg-[#EAECEF]" />
      <span className="asm:text-sm asm:text-center">
        Copyright © 2022. ViCA. All Rights Reserved.
      </span>
    </footer>
  );
};

export default Footer;
