// app/auth/update-password/page.tsx
import { UpdatePasswordForm } from '@/components/update-password-form';

export default function Page() {
  return (
    <div className="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-[#0a0a0f] p-6 md:p-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-[#6C63FF]/15 blur-[120px]" />
        <div className="absolute -right-40 -bottom-40 h-[600px] w-[600px] rounded-full bg-[#4FD1C5]/10 blur-[120px]" />
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#B794F6]/10 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <UpdatePasswordForm />
      </div>
    </div>
  );
}