import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { StepActions } from '../StepActions';
import { ProcedureStepWithProgress } from '@/lib/types';

describe('StepActions', () => {
  const mockStep: ProcedureStepWithProgress = {
    id: 1,
    name: 'テストステップ',
    description: 'テスト説明',
    displayOrder: 1,
    progressStatus: 'NOT_STARTED',
    canStart: true,
  };

  const mockOnStart = vi.fn();
  const mockOnComplete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('NOT_STARTED status', () => {
    it('should render start button when step is not started', () => {
      render(
        <StepActions
          step={mockStep}
          onStart={mockOnStart}
          onComplete={mockOnComplete}
          isStarting={false}
          isCompleting={false}
        />
      );

      const startButton = screen.getByText('開始');
      expect(startButton).toBeInTheDocument();
    });

    it('should call onStart when start button is clicked', () => {
      render(
        <StepActions
          step={mockStep}
          onStart={mockOnStart}
          onComplete={mockOnComplete}
          isStarting={false}
          isCompleting={false}
        />
      );

      const startButton = screen.getByText('開始');
      fireEvent.click(startButton);

      expect(mockOnStart).toHaveBeenCalledTimes(1);
    });

    it('should disable start button when isStarting is true', () => {
      render(
        <StepActions
          step={mockStep}
          onStart={mockOnStart}
          onComplete={mockOnComplete}
          isStarting={true}
          isCompleting={false}
        />
      );

      const startButton = screen.getByText('開始中...');
      expect(startButton).toBeDisabled();
    });
  });

  describe('File Upload Step', () => {
    const fileUploadStep: ProcedureStepWithProgress = {
      ...mockStep,
      name: '入学願書の提出',
      progressStatus: 'IN_PROGRESS',
    };

    it('should render file upload UI for file upload steps', () => {
      render(
        <StepActions
          step={fileUploadStep}
          onStart={mockOnStart}
          onComplete={mockOnComplete}
          isStarting={false}
          isCompleting={false}
        />
      );

      expect(screen.getByText(/ファイルを選択/)).toBeInTheDocument();
    });

    it('should accept Excel and PDF files', () => {
      render(
        <StepActions
          step={fileUploadStep}
          onStart={mockOnStart}
          onComplete={mockOnComplete}
          isStarting={false}
          isCompleting={false}
        />
      );

      const fileInput = screen.getByLabelText(/ファイルを選択/);
      expect(fileInput).toHaveAttribute('accept');
      const acceptAttr = fileInput.getAttribute('accept');
      expect(acceptAttr).toContain('.xlsx');
      expect(acceptAttr).toContain('.pdf');
    });

    it('should show error for invalid file types', () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      
      render(
        <StepActions
          step={fileUploadStep}
          onStart={mockOnStart}
          onComplete={mockOnComplete}
          isStarting={false}
          isCompleting={false}
        />
      );

      const fileInput = screen.getByLabelText(/ファイルを選択/) as HTMLInputElement;
      const invalidFile = new File(['content'], 'test.txt', { type: 'text/plain' });
      
      // FileListをモック
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(invalidFile);
      Object.defineProperty(fileInput, 'files', {
        value: dataTransfer.files,
        writable: false,
      });

      fireEvent.change(fileInput);

      expect(alertSpy).toHaveBeenCalled();
      alertSpy.mockRestore();
    });
  });

  describe('Payment Step', () => {
    const paymentStep: ProcedureStepWithProgress = {
      ...mockStep,
      name: '入学検定料の納付',
      progressStatus: 'IN_PROGRESS',
    };

    it('should render payment UI for payment steps', () => {
      render(
        <StepActions
          step={paymentStep}
          onStart={mockOnStart}
          onComplete={mockOnComplete}
          isStarting={false}
          isCompleting={false}
        />
      );

      expect(screen.getByText(/決済方法を選択/)).toBeInTheDocument();
      expect(screen.getByText('クレジットカード')).toBeInTheDocument();
      expect(screen.getByText('銀行振込')).toBeInTheDocument();
    });

    it('should show payment amount for exam fee', () => {
      render(
        <StepActions
          step={paymentStep}
          onStart={mockOnStart}
          onComplete={mockOnComplete}
          isStarting={false}
          isCompleting={false}
        />
      );

      expect(screen.getByText(/¥35,000/)).toBeInTheDocument();
    });

    it('should show payment amount for admission fee', () => {
      const admissionFeeStep: ProcedureStepWithProgress = {
        ...mockStep,
        name: '入学金の納付',
        progressStatus: 'IN_PROGRESS',
      };

      render(
        <StepActions
          step={admissionFeeStep}
          onStart={mockOnStart}
          onComplete={mockOnComplete}
          isStarting={false}
          isCompleting={false}
        />
      );

      expect(screen.getByText(/¥282,000/)).toBeInTheDocument();
    });
  });

  describe('COMPLETED status', () => {
    const completedStep: ProcedureStepWithProgress = {
      ...mockStep,
      progressStatus: 'COMPLETED',
    };

    it('should show completed status', () => {
      render(
        <StepActions
          step={completedStep}
          onStart={mockOnStart}
          onComplete={mockOnComplete}
          isStarting={false}
          isCompleting={false}
        />
      );

      expect(screen.getByText('完了済み')).toBeInTheDocument();
    });
  });

  describe('Regular Step (IN_PROGRESS)', () => {
    const inProgressStep: ProcedureStepWithProgress = {
      ...mockStep,
      progressStatus: 'IN_PROGRESS',
    };

    it('should render complete button for regular in-progress steps', () => {
      render(
        <StepActions
          step={inProgressStep}
          onStart={mockOnStart}
          onComplete={mockOnComplete}
          isStarting={false}
          isCompleting={false}
        />
      );

      const completeButton = screen.getByText('完了');
      expect(completeButton).toBeInTheDocument();
    });

    it('should call onComplete when complete button is clicked', () => {
      render(
        <StepActions
          step={inProgressStep}
          onStart={mockOnStart}
          onComplete={mockOnComplete}
          isStarting={false}
          isCompleting={false}
        />
      );

      const completeButton = screen.getByText('完了');
      fireEvent.click(completeButton);

      expect(mockOnComplete).toHaveBeenCalledTimes(1);
    });
  });
});

