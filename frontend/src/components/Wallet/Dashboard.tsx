import { useState } from 'react';
import { GrTransaction } from 'react-icons/gr';
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
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell>Date</Table.HeadCell>
                <Table.HeadCell>Currency</Table.HeadCell>
                <Table.HeadCell>Amount</Table.HeadCell>
                <Table.HeadCell>Revenue percent</Table.HeadCell>
                <Table.HeadCell>Current revenue</Table.HeadCell>
                <Table.HeadCell>Estimate revenue</Table.HeadCell>
                <Table.HeadCell>Staking period</Table.HeadCell>
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
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {transaction?.status}
                    </Table.Cell>
                    <Table.Cell>
                      {transaction?.created_at.split('T')[0]}
                    </Table.Cell>
                    <Table.Cell>{transaction?.currency}</Table.Cell>
                    <Table.Cell>
                      {parseFloat(parseFloat(transaction?.amount).toFixed(6))}
                    </Table.Cell>
                    <Table.Cell>{`${transaction?.revenue_percent?.period_percent}%`}</Table.Cell>
                    <Table.Cell>
                      {parseFloat(transaction?.current_revenue?.toFixed(6))}
                    </Table.Cell>
                    <Table.Cell>
                      {parseFloat(transaction?.estimate_revenue?.toFixed(6))}
                    </Table.Cell>
                    <Table.Cell>
                      {`${
                        transaction?.stacking_period?.years
                          ? `${transaction?.stacking_period?.years} years,`
                          : ''
                      }  ${
                        transaction?.stacking_period?.months
                          ? `${transaction?.stacking_period?.months} months,`
                          : ''
                      } ${
                        transaction?.stacking_period?.days
                          ? `${transaction?.stacking_period?.days} days`
                          : ''
                      }`}
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
