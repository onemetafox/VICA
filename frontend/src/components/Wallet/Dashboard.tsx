/* eslint-disable no-nested-ternary */
/* eslint-disable prettier/prettier */
import { useState } from 'react';
import { GrTransaction, GrLink } from 'react-icons/gr';
import { Table, Modal, Button } from 'flowbite-react';
import Container from './Container';
import Card from './Card';

const Dashboard = ({ user, transactions }: any) => {
  const {
    bitcoin_wallet: btcWallet,
    ethereum_wallet: ethWallet,
    has_active_arbitrage_account: subscribed,
  } = user;
  const [showModal, setShowModal] = useState(false);
  const onClose = () => setShowModal(false);
  const onViewTransaction = () => setShowModal(true);

  return (
    <Container>
      <div>
        <div className="grid grid-cols-4 gap-9 xl:grid-cols-2 xl:gap-9 ed:grid-cols-1 justify-center w-full">
          <Card
            coin="BTC"
            balance={btcWallet?.active_balance}
            walletAddress={btcWallet?.address}
            isArbitrage={false}
            isSubscribed={subscribed}
          />
          <Card
            coin="USDT"
            balance={ethWallet?.active_usdt_balance}
            walletAddress={ethWallet?.address}
            isArbitrage={false}
            isSubscribed={subscribed}
          />
          <Card
            coin="ETH"
            balance={ethWallet?.active_balance}
            walletAddress={ethWallet?.address}
            isArbitrage={false}
            isSubscribed={subscribed}
          />
          <Card
            coin="VICA"
            balance={ethWallet?.active_vica_balance}
            walletAddress={ethWallet?.address}
            isArbitrage={false}
            isSubscribed={subscribed}
          />
        </div>
        <div className="border border-mediumGray bg-white rounded-lg w-full p-8 mt-10">
          <h1 className="font-poppinsLarge font-black">Latest transactions</h1>
          {transactions?.length ? (
            <Table striped>
              <Table.Head>
                <Table.HeadCell>Date</Table.HeadCell>
                <Table.HeadCell>Type</Table.HeadCell>
                <Table.HeadCell>Currency</Table.HeadCell>
                <Table.HeadCell>Amount</Table.HeadCell>
                <Table.HeadCell>From</Table.HeadCell>
                <Table.HeadCell>To</Table.HeadCell>
                <Table.HeadCell>Tnx</Table.HeadCell>
                {/* <Table.HeadCell>
                  <span className="sr-only">View</span>
          </Table.HeadCell> */}
              </Table.Head>
              <Table.Body className="divide-y">
                {transactions?.map((transaction) => (
                  <Table.Row
                    key={transaction?.id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell>
                      {transaction?.timestamp &&
                        new Date(transaction.timestamp * 1000).toLocaleString(
                          'en-US',
                          { timeZone: 'UTC' }
                        )}
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {transaction?.to == ethWallet?.address ||
                        transaction?.to == btcWallet?.address
                        ? 'Deposit'
                        : 'Withdraw'}
                    </Table.Cell>
                    <Table.Cell>{transaction?.currency}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {parseFloat(parseFloat(transaction?.amount).toFixed(6))}
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{transaction?.to == ethWallet?.address || transaction?.to == btcWallet?.address ? (transaction?.from ? transaction?.from : 'This Wallet') : 'This Wallet'}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {transaction?.to == ethWallet?.address ||
                        transaction?.to == btcWallet?.address
                        ? 'This Wallet'
                        : transaction?.to}
                    </Table.Cell>
                    <Table.Cell>
                      <div className="inline-flex items-center">
                        <a
                          target="_blank"
                          href={`https://etherscan.io/tx/${transaction?.hash}`}
                          rel="noreferrer"
                        >
                          {transaction?.hash}
                        </a>
                        <GrLink className="text-blue-700 text-xl ml-2" />
                      </div>
                    </Table.Cell>
                    {/* <Table.Cell>
                      <Button onClick={onViewTransaction}>View</Button>
                    </Table.Cell> */}
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          ) : (
            <div className="flex flex-col justify-center items-center my-10">
              <GrTransaction className="text-blue-700 text-3xl mb-3" />
              <h1 className="text-darkGray">
                Your 10 most recent transactions will appear here
              </h1>
            </div>
          )}
        </div>
      </div>
      <Modal show={showModal} position="center" onClose={onClose}>
        <Modal.Header>Transaction details (soon)</Modal.Header>
      </Modal>
    </Container>
  );
};

export default Dashboard;
