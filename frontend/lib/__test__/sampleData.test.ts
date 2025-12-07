import { describe, it, expect } from 'vitest';
import {
  sampleUniversities,
  sampleProcedureFlows,
  samplePayments,
  sampleContents,
  createSampleProcedureFlowDetail,
} from '../sampleData';
import { University, ProcedureFlow, Payment, Content } from '../types';

describe('sampleData', () => {
  describe('sampleUniversities', () => {
    it('should have at least 20 universities', () => {
      expect(sampleUniversities.length).toBeGreaterThanOrEqual(20);
    });

    it('should have valid university structure', () => {
      sampleUniversities.forEach((university: University) => {
        expect(university).toHaveProperty('id');
        expect(university).toHaveProperty('code');
        expect(university).toHaveProperty('name');
        expect(university).toHaveProperty('active');
        expect(typeof university.id).toBe('number');
        expect(typeof university.code).toBe('string');
        expect(typeof university.name).toBe('string');
        expect(typeof university.active).toBe('boolean');
      });
    });

    it('should have unique IDs', () => {
      const ids = sampleUniversities.map((u: University) => u.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have unique codes', () => {
      const codes = sampleUniversities.map((u: University) => u.code);
      const uniqueCodes = new Set(codes);
      expect(uniqueCodes.size).toBe(codes.length);
    });
  });

  describe('sampleProcedureFlows', () => {
    it('should have valid procedure flow structure', () => {
      sampleProcedureFlows.forEach((flow: ProcedureFlow) => {
        expect(flow).toHaveProperty('id');
        expect(flow).toHaveProperty('universityId');
        expect(flow).toHaveProperty('name');
        expect(flow).toHaveProperty('flowType');
        expect(flow).toHaveProperty('steps');
        expect(Array.isArray(flow.steps)).toBe(true);
      });
    });

    it('should have steps with valid structure', () => {
      sampleProcedureFlows.forEach((flow: ProcedureFlow) => {
        flow.steps?.forEach((step) => {
          expect(step).toHaveProperty('id');
          expect(step).toHaveProperty('name');
          // displayOrderはオプショナルな場合がある
          if ('displayOrder' in step) {
            expect(typeof step.displayOrder).toBe('number');
          }
        });
      });
    });
  });

  describe('samplePayments', () => {
    it('should have valid payment structure', () => {
      samplePayments.forEach((payment: Payment) => {
        expect(payment).toHaveProperty('id');
        expect(payment).toHaveProperty('universityId');
        expect(payment).toHaveProperty('amount');
        expect(payment).toHaveProperty('status');
        expect(payment).toHaveProperty('paymentType');
        expect(typeof payment.amount).toBe('number');
        expect(payment.amount).toBeGreaterThan(0);
      });
    });

    it('should have valid status values', () => {
      const validStatuses = ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED'];
      samplePayments.forEach((payment: Payment) => {
        expect(validStatuses).toContain(payment.status);
      });
    });
  });

  describe('sampleContents', () => {
    it('should have valid content structure', () => {
      sampleContents.forEach((content: Content) => {
        expect(content).toHaveProperty('id');
        expect(content).toHaveProperty('universityId');
        expect(content).toHaveProperty('title');
        expect(content).toHaveProperty('status');
        expect(typeof content.id).toBe('number');
        expect(typeof content.title).toBe('string');
      });
    });
  });


  describe('createSampleProcedureFlowDetail', () => {
    it('should return null for non-existent flow', () => {
      const result = createSampleProcedureFlowDetail(99999, 99999);
      expect(result).toBeNull();
    });

    it('should return valid flow detail for existing flow', () => {
      if (sampleProcedureFlows.length > 0) {
        const flow = sampleProcedureFlows[0];
        const result = createSampleProcedureFlowDetail(flow.id, flow.universityId);
        
        expect(result).not.toBeNull();
        if (result) {
          expect(result).toHaveProperty('id');
          expect(result).toHaveProperty('universityId');
          expect(result).toHaveProperty('name');
          expect(result).toHaveProperty('steps');
          expect(result).toHaveProperty('totalSteps');
          expect(result).toHaveProperty('completedSteps');
          expect(result).toHaveProperty('inProgressSteps');
          expect(result).toHaveProperty('notStartedSteps');
          expect(result).toHaveProperty('completionRate');
          expect(typeof result.completionRate).toBe('number');
          expect(result.completionRate).toBeGreaterThanOrEqual(0);
          expect(result.completionRate).toBeLessThanOrEqual(100);
        }
      }
    });

    it('should calculate completion rate correctly', () => {
      if (sampleProcedureFlows.length > 0) {
        const flow = sampleProcedureFlows[0];
        const result = createSampleProcedureFlowDetail(flow.id, flow.universityId);
        
        if (result && result.totalSteps > 0) {
          const expectedRate = (result.completedSteps / result.totalSteps) * 100;
          expect(result.completionRate).toBe(expectedRate);
        }
      }
    });
  });
});

