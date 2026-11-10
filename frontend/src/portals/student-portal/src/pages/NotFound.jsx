import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <>
      <PageHeader title="Page not found" subtitle="The page you are looking for does not exist." />
      <Card><EmptyState title="We couldn’t find that page" hint="Check the address or head back to your dashboard." />
        <div style={{ textAlign: 'center' }}><Button variant="primary" onClick={() => navigate('/')}>Go to dashboard</Button></div></Card>
    </>
  );
}
