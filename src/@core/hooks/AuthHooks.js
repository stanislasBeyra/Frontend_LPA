import { useEffect } from 'react';
import { useRouter } from 'next/router';

const useAuthRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/pages/login'); // Redirige vers la page de connexion si pas de token
    }
  }, [router]);
};

export default useAuthRedirect;
