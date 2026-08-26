'use client';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@ui-registry/input-otp';

export function InputOtpDemo() {
  return (
    <InputOTP maxLength={6}>
      <InputOTPGroup>
        {Array.from({ length: 6 }, (_, i) => <InputOTPSlot key={i} index={i} />)}
      </InputOTPGroup>
    </InputOTP>
  );
}
