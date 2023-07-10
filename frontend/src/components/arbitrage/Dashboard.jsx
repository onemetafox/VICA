import { useState } from 'react';
import { GrTransaction } from 'react-icons/gr';
import { Table, Modal, Button } from 'flowbite-react';
import { useReqWithdraw } from 'src/queries/transactions';
import Container from '../Wallet/Container';
import Card from '../Wallet/Card';

const Dashboard = ({ user, transactions }) => {
  const { bitcoin_wallet: btcWallet, ethereum_wallet: ethWallet } = user;
  const [showModal, setShowModal] = useState(false);
  const onClose = () => setShowModal(false);
  const onViewTransaction = () => setShowModal(true);
  const reqWithdrawMutation = useReqWithdraw();

  let ethBlanace = 0;
  let btcBlanace = 0;
  let usdtBlanace = 0;
  let vicaBlanace = 0;

  const handleReqWithdraw = (TransactionId) => {
    if (TransactionId) {
      reqWithdrawMutation.mutate(TransactionId);
    }
  };

  const onSuccess = () => {
    setShowModal(false);
  };

  transactions?.map((transaction) => {
    if (transaction?.status == 'ACTIVE' || transaction?.status == 'PENDING') {
      if (transaction?.currency == 'ETH') {
        return (ethBlanace += Number(
          transaction.amount + transaction.current_revenue
        ));
      }
      if (transaction?.currency == 'VICA') {
        return (vicaBlanace += Number(
          transaction.amount + transaction.current_revenue
        ));
      }
      if (transaction?.currency == 'USDT') {
        return (usdtBlanace += Number(
          transaction.amount + transaction.current_revenue
        ));
      }
      if (transaction?.currency == 'USDT') {
        return (btcBlanace += Number(
          transaction.amount + transaction.current_revenue
        ));
      }
    }
    return 0;
  });

  return (
    <Container>
      <div>
        <div className="grid grid-cols-4 gap-9 xl:grid-cols-2 xl:gap-9 ed:grid-cols-1 justify-center w-full">
          <Card
            coin="BTC"
            balance={btcBlanace}
            walletAddress={btcWallet?.address}
            isArbitrage
          />
          <Card
            coin="USDT"
            balance={usdtBlanace}
            walletAddress={ethWallet?.address}
            isArbitrage
          />
          <Card
            coin="ETH"
            balance={ethBlanace}
            walletAddress={ethWallet?.address}
            isArbitrage
          />
          <Card
            coin="VICA"
            balance={vicaBlanace}
            walletAddress={ethWallet?.address}
            isArbitrage
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
                <Table.HeadCell>
                  Estimated revenue (next 3 months)
                </Table.HeadCell>
                <Table.HeadCell>Staking period</Table.HeadCell>
                <Table.HeadCell>
                  <span className="sr-only">View</span>
                </Table.HeadCell>
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
                    <Table.Cell className="text-green-400">
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
                    <Table.Cell>
                      <Button
                        disabled={transaction?.status == 'ACTIVE' ? 0 : 1}
                        onClick={() => handleReqWithdraw(transaction?.id)}
                      >
                        {!transaction?.status == 'PENDING'
                          ? 'Request Withdraw'
                          : 'Request Sent'}
                      </Button>
                    </Table.Cell>
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
        <Modal.Header>Request Withdraw</Modal.Header>
        <div className="text-center">
          <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            Please confirm to Withdraw this transaction !
          </h3>
          <div className="flex justify-center gap-4">
            <Button color="success" onClick={() => onSuccess}>
              Confirm
            </Button>
            <Button color="gray" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </Container>
  );
};

export default Dashboard;
