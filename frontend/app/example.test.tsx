import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('Example Test', () => {
  it('should render correctly', () => {
    const TestComponent = () => <div>Test Component</div>;
    render(<TestComponent />);
    expect(screen.getByText('Test Component')).toBeInTheDocument();
  });
});



