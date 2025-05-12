import React from 'react';
import { useNavigate } from 'react-router';

type SignInPageProps = {
  onLogin: () => void;
};

const SignInPage: React.FC<SignInPageProps> = ({ onLogin }) => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    onLogin();              // update auth state
    navigate('/');          // redirect to dashboard
  };

  return (
    <div>
      <h2>Sign In</h2>
      <button onClick={handleSignIn}>Sign In</button>
    </div>
  );
};

export default SignInPage;
