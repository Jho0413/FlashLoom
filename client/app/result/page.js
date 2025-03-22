'use client'
import {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import { Typography, Container, Button } from '@mui/material'
import LoadingPage from '../components/common/loadingPage'
import ErrorPage from '../components/common/errorPage'

const ResultPage = ({ searchParams }) => {
    const { session_id } = searchParams;
    const [session, setSession] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCheckoutSession = async () => {
            if (!session_id) return
            try {
                const response = await fetch(`/api/checkout_sessions?session_id=${session_id}`);
                const data = await response.json();
                if (response.ok) {
                    setSession(data);
                } else {
                    setError(data.error);
                }
            } catch (err) {
                setError('An error occurred while fetching the checkout session');
            }
            finally {
                setLoading(false);
            }
        }
        fetchCheckoutSession();
    }, [session_id])
    
    if (loading) {
        return <LoadingPage />
    }
    if (error) {
        return <ErrorPage />
    }

    return (
        <Container 
          maxwidth="100vw" 
          sx={{
            height: "100vh", 
            overflowY: 'auto', 
          }}>
            {session.payment_status === 'paid' ? (
                <ResultContent 
                  header="Payment Succeeded!"
                  body="We have received your payment. Go generate flashcards to start using your subscription!"
                />
            ) : (
                <ResultContent 
                  header="Payment Failed :("
                  body="Your payment was not successful. Please try again!"
                />
            )}
        </Container>
)}


const ResultContent = ({ header, body }) => {
  const router  = useRouter();

  return (
    <Container
      maxWidth="md"
      sx={{
        height: "100%",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        gap: 3,
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Typography variant='h3'>{header}</Typography>
      <Typography variant="body1">{body}</Typography>
      <Button variant="contained" onClick={() => router.push('/')}>
        Back to Main Page
      </Button>
    </Container>
  )
}

export default ResultPage;