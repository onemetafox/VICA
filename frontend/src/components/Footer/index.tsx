import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import Image from 'next/image';
import {
  RiDiscordFill,
  RiTelegramFill,
  RiFacebookCircleFill,
  RiTwitterFill,
  RiLinkedinFill,
  RiYoutubeFill,
  RiMediumFill,
} from 'react-icons/ri';
import { SiTiktok } from 'react-icons/si';
import logo from '../../../public/logo.png';

type Props = {
  bgColor?: string;
};
const Footer = ({ bgColor = 'bg-lightGray' }: Props) => {
  const router = useRouter();

  const handleBuyEthereum = () => {
    window.open(`/buy?currency=ETHER`, '_blank');
  };

  const handleBuyBTc = () => {
    window.open(`/buy?currency=btc`, '_blank');
  };

  const handleSellEthereum = () => {
    window.open(`/sell?currency=ETHER`, '_blank');
  };

  const handleSellBtc = () => {
    window.open(`/sell?currency=btc`, '_blank');
  };

  return (
    <footer
      className={`flex h-full flex-col items-center px-20 py-16 md:px-10 ${bgColor}`}
    >
      <div className="flex w-full flex-wrap justify-between">
        <div className="w-1/4 lg:hidden">
          <div className="flex items-center">
            <Image src={logo} width={70} height={70} />
            <h1 className="ml-3 font-poppinsLarge text-2xl font-black">ViCA</h1>
          </div>
          <p className="mt-2 text-justify">
            Buy and sell digital currencies. Get your ViCA account to start
            accepting payments and sending money.
          </p>
        </div>
        <div className="flex flex-col sm:w-1/2">
          <h1 className="mb-3 text-lg font-bold">For you</h1>

          <span
            className="mb-2 cursor-pointer text-lightBlack hover:text-blue-700"
            onClick={handleBuyBTc}
          >
            Buy Bitcoin
          </span>

          <span
            className="mb-2 cursor-pointer text-lightBlack hover:text-blue-700"
            onClick={handleBuyEthereum}
          >
            Buy Ethereum
          </span>

          <span
            className="mb-2 cursor-pointer text-lightBlack hover:text-blue-700"
            onClick={handleSellBtc}
          >
            Sell Bitcoin
          </span>

          <span
            className="mb-2 cursor-pointer text-lightBlack hover:text-blue-700"
            onClick={handleSellEthereum}
          >
            Sell Ethereum
          </span>
          <Link href="/wallet">
            <span className="mb-2 cursor-pointer hover:text-blue-700">
              ViCA Wallet
            </span>
          </Link>
        </div>
        <div className="flex flex-col axs:mt-5">
          <h1 className="mb-3 text-lg font-bold">About ViCA</h1>
          <Link href="https://vica.global/">
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
          <Link href="https://t.me/joinchat/SZUUF7kprWoyNzk5">
            <span className="mb-2 cursor-pointer text-lightBlack hover:text-blue-700">
              Announcement
            </span>
          </Link>
        </div>
        <div className="flex flex-col">
          <h1 className="mb-4 text-lg font-bold sm:mt-5">Community</h1>
          <div className="grid grid-cols-4 gap-5">
            <a
              href="https://discord.gg/E9kKufkh"
              target="_blank"
              rel="noreferrer"
            >
              <RiDiscordFill className="h-5 w-5 text-darkBlack hover:text-blue-700" />
            </a>
            <a
              href="https://t.me/joinchat/SZUUF7kprWoyNzk5"
              target="_blank"
              rel="noreferrer"
            >
              <RiTelegramFill className="h-5 w-5 text-darkBlack hover:text-blue-700" />
            </a>
            <a
              href="https://www.facebook.com/ViCA-GLOBAL-102297372207693"
              target="_blank"
              rel="noreferrer"
            >
              <RiFacebookCircleFill className="h-5 w-5 text-darkBlack hover:text-blue-700" />
            </a>
            <a
              href="https://medium.com/@vicafoundation"
              target="_blank"
              rel="noreferrer"
            >
              <RiMediumFill className="h-5 w-5 text-darkBlack hover:text-blue-700" />
            </a>
            <a
              href="https://twitter.com/ViCA_Foundation"
              target="_blank"
              rel="noreferrer"
            >
              <RiTwitterFill className="h-5 w-5 text-darkBlack hover:text-blue-700" />
            </a>
            <a
              href="https://kr.linkedin.com/company/vica-foundation?trk=public_profile_experience-item_profile-section-card_subtitle-click"
              target="_blank"
              rel="noreferrer"
            >
              <RiLinkedinFill className="h-5 w-5 text-darkBlack hover:text-blue-700" />
            </a>
            <a
              href="https://www.youtube.com/channel/UCaB5eMtQ2Wk-HBZd0NSMX_w"
              target="_blank"
              rel="noreferrer"
            >
              <RiYoutubeFill className="h-5 w-5 text-darkBlack hover:text-blue-700" />
            </a>
          </div>
        </div>
      </div>
      <div className="mt-10 mb-10 h-[1px] w-full bg-[#EAECEF]" />
      <span className="asm:text-sm asm:text-center">
        Copyright © 2023. ViCA. All Rights Reserved.
      </span>
    </footer>
  );
};

export default Footer;
