'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type PasswordInputProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  showStrength?: boolean;
  required?: boolean;
};

// 🎯 Проверка требований пароля
export function checkPasswordStrength(password: string) {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  const passedCount = Object.values(checks).filter(Boolean).length;

  let level: 'weak' | 'medium' | 'strong' = 'weak';
  if (passedCount >= 5) level = 'strong';
  else if (passedCount >= 3) level = 'medium';

  return { checks, passedCount, level };
}

export function PasswordInput({
  id,
  value,
  onChange,
  placeholder = '••••••••',
  showStrength = false,
  required = false,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const { checks, passedCount, level } = checkPasswordStrength(value);

  const levelColors = {
    weak: 'from-red-500 to-red-400',
    medium: 'from-yellow-500 to-orange-400',
    strong: 'from-green-500 to-emerald-400',
  };

  const levelLabels = {
    weak: 'Слабый',
    medium: 'Средний',
    strong: 'Надёжный',
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <Input
          id={id}
          type={visible ? 'text' : 'password'}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="border-white/10 bg-white/[0.03] pl-10 pr-12 text-white placeholder:text-white/30 focus:border-[#6C63FF]/50 focus:ring-[#6C63FF]/20"
        />

        {/* Иконка замка слева */}
        <svg
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>

        {/* 🎯 Кнопка-глаз */}
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 transition hover:text-white"
          tabIndex={-1}
        >
          {visible ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* 🎯 Индикатор сложности */}
      {showStrength && value.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-3"
        >
          {/* Полоса сложности */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/40">Сложность пароля</span>
              <span
                className={`font-medium ${
                  level === 'weak'
                    ? 'text-red-400'
                    : level === 'medium'
                      ? 'text-yellow-400'
                      : 'text-green-400'
                }`}
              >
                {levelLabels[level]}
              </span>
            </div>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    i < passedCount
                      ? `bg-gradient-to-r ${levelColors[level]}`
                      : 'bg-white/10'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Требования */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <Requirement passed={checks.length} label="8+ символов" />
            <Requirement passed={checks.uppercase} label="Заглавная" />
            <Requirement passed={checks.lowercase} label="Строчная" />
            <Requirement passed={checks.number} label="Цифра" />
            <Requirement passed={checks.special} label="Спецсимвол" />
          </div>
        </motion.div>
      )}
    </div>
  );
}

function Requirement({ passed, label }: { passed: boolean; label: string }) {
  return (
    <div
      className={`flex items-center gap-1.5 transition-colors ${
        passed ? 'text-green-400' : 'text-white/30'
      }`}
    >
      {passed ? (
        <Check className="h-3 w-3" />
      ) : (
        <X className="h-3 w-3" />
      )}
      <span>{label}</span>
    </div>
  );
}