type LoginResponse = {
  token: string;
  user_data: User;
};

type SendOTPResponse = {
  attempt_count: number;
  expired_at: string;
};

type VerifyOTPResponse = {
  token: string;
  user_data: User;
};
