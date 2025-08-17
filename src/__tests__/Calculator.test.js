import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Calculator from '../Calculator';

describe('Calculator Component', () => {
  test('renders all buttons', () => {
    render(<Calculator />);
    const buttons = ['AC', '+/−', '%', '÷', '7', '8', '9', '×', '4', '5', '6', '−', '1', '2', '3', '+', '0', '.', '='];
    buttons.forEach(btn => {
      expect(screen.getByText(btn)).toBeInTheDocument();
    });
  });

  test('performs addition correctly', () => {
    render(<Calculator />);
    fireEvent.click(screen.getByText('2'));
    fireEvent.click(screen.getByText('+'));
    fireEvent.click(screen.getByText('3'));
    fireEvent.click(screen.getByText('='));
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  test('prevents multiple decimals in a number', () => {
    render(<Calculator />);
    fireEvent.click(screen.getByText('2'));
    fireEvent.click(screen.getByText('.'));
    fireEvent.click(screen.getByText('.'));
    expect(screen.getByText('2.')).toBeInTheDocument(); // only one dot should appear
  });

  test('handles sign toggle (+/−)', () => {
    render(<Calculator />);
    fireEvent.click(screen.getByText('5'));
    fireEvent.click(screen.getByText('+/−'));
    expect(screen.getByText('-5')).toBeInTheDocument();
  });

  test('calculates percentage correctly', () => {
    render(<Calculator />);
    fireEvent.click(screen.getByText('5'));
    fireEvent.click(screen.getByText('0'));
    fireEvent.click(screen.getByText('%'));
    expect(screen.getByText('0.5')).toBeInTheDocument();
  });

  test('clears input when AC is pressed', () => {
    render(<Calculator />);
    fireEvent.click(screen.getByText('7'));
    fireEvent.click(screen.getByText('AC'));
    expect(screen.getByText('0')).toBeInTheDocument(); // default display after clearing
  });
});

