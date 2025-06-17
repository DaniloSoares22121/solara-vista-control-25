
import React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface FileInputProps {
  onFileChange: (file: File | null) => void;
  accept?: string;
  className?: string;
}

export function FileInput({ onFileChange, accept, className }: FileInputProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onFileChange(file);
  };

  return (
    <Input
      type="file"
      accept={accept}
      onChange={handleFileChange}
      className={cn("file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100", className)}
    />
  );
}
