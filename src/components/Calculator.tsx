import { useState } from 'react';
import { Delete } from 'lucide-react';
import { CalculatorState, CalculatorOperation } from '../types/keyboard';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface CalculatorProps {
  onInput: (char: string) => void;
  onClose: () => void;
}

export function Calculator({ onInput, onClose }: CalculatorProps) {
  const { user } = useAuth();
  const [state, setState] = useState<CalculatorState>({
    display: '0',
    currentValue: 0,
    previousValue: null,
    operation: null,
    shouldResetDisplay: false,
  });
  const [isCalculatorMode, setIsCalculatorMode] = useState(false);

  const handleNumberClick = (num: string) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }

    if (isCalculatorMode) {
      if (state.shouldResetDisplay) {
        setState(prev => ({
          ...prev,
          display: num,
          currentValue: parseFloat(num),
          shouldResetDisplay: false,
        }));
      } else {
        const newDisplay = state.display === '0' ? num : state.display + num;
        setState(prev => ({
          ...prev,
          display: newDisplay,
          currentValue: parseFloat(newDisplay),
        }));
      }
    } else {
      onInput(num);
    }
  };

  const handleOperationClick = (op: CalculatorOperation) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }

    if (!isCalculatorMode) {
      onInput(op);
      return;
    }

    if (op === '=') {
      if (state.operation && state.previousValue !== null) {
        const result = calculate(state.previousValue, state.currentValue, state.operation);
        const expression = `${state.previousValue} ${state.operation} ${state.currentValue}`;

        setState({
          display: result.toString(),
          currentValue: result,
          previousValue: null,
          operation: null,
          shouldResetDisplay: true,
        });

        if (user) {
          saveToHistory(expression, result.toString());
        }
      }
    } else {
      if (state.operation && state.previousValue !== null && !state.shouldResetDisplay) {
        const result = calculate(state.previousValue, state.currentValue, state.operation);
        setState({
          display: result.toString(),
          currentValue: result,
          previousValue: result,
          operation: op,
          shouldResetDisplay: true,
        });
      } else {
        setState(prev => ({
          ...prev,
          previousValue: prev.currentValue,
          operation: op,
          shouldResetDisplay: true,
        }));
      }
    }
  };

  const calculate = (a: number, b: number, op: CalculatorOperation): number => {
    switch (op) {
      case '+':
        return a + b;
      case '-':
        return a - b;
      case '*':
        return a * b;
      case '/':
        return b !== 0 ? a / b : 0;
      default:
        return b;
    }
  };

  const saveToHistory = async (expression: string, result: string) => {
    if (!user) return;

    await supabase.from('calculator_history').insert({
      user_id: user.id,
      expression,
      result,
    });
  };

  const handleClear = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
    setState({
      display: '0',
      currentValue: 0,
      previousValue: null,
      operation: null,
      shouldResetDisplay: false,
    });
  };

  const handleBackspace = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }

    if (isCalculatorMode) {
      const newDisplay = state.display.length > 1 ? state.display.slice(0, -1) : '0';
      setState(prev => ({
        ...prev,
        display: newDisplay,
        currentValue: parseFloat(newDisplay),
      }));
    } else {
      onInput('⌫');
    }
  };

  const handleDecimal = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }

    if (isCalculatorMode) {
      if (!state.display.includes('.')) {
        setState(prev => ({
          ...prev,
          display: prev.display + '.',
        }));
      }
    } else {
      onInput('.');
    }
  };

  const toggleMode = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
    setIsCalculatorMode(!isCalculatorMode);
  };

  return (
    <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-3">
      {isCalculatorMode && (
        <div className="bg-gray-900 rounded-lg p-4 mb-3">
          <div className="text-right text-white">
            <div className="text-sm text-gray-400 h-6">
              {state.previousValue !== null && state.operation
                ? `${state.previousValue} ${state.operation}`
                : ''}
            </div>
            <div className="text-3xl font-light overflow-x-auto scrollbar-hide">
              {state.display}
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-2">
        <button
          onClick={toggleMode}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            isCalculatorMode
              ? 'bg-blue-500 text-white'
              : 'bg-gray-700 text-gray-300'
          }`}
        >
          {isCalculatorMode ? 'Calc Mode' : '123'}
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg font-medium text-sm
                   hover:bg-gray-600 active:scale-95 transition-all"
        >
          ABC
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={() => handleNumberClick('7')}
          className="aspect-square bg-gray-700 text-white text-xl font-medium rounded-lg
                   hover:bg-gray-600 active:scale-95 transition-all"
        >
          7
        </button>
        <button
          onClick={() => handleNumberClick('8')}
          className="aspect-square bg-gray-700 text-white text-xl font-medium rounded-lg
                   hover:bg-gray-600 active:scale-95 transition-all"
        >
          8
        </button>
        <button
          onClick={() => handleNumberClick('9')}
          className="aspect-square bg-gray-700 text-white text-xl font-medium rounded-lg
                   hover:bg-gray-600 active:scale-95 transition-all"
        >
          9
        </button>
        <button
          onClick={() => handleOperationClick('/')}
          className="aspect-square bg-orange-500 text-white text-xl font-medium rounded-lg
                   hover:bg-orange-600 active:scale-95 transition-all"
        >
          ÷
        </button>

        <button
          onClick={() => handleNumberClick('4')}
          className="aspect-square bg-gray-700 text-white text-xl font-medium rounded-lg
                   hover:bg-gray-600 active:scale-95 transition-all"
        >
          4
        </button>
        <button
          onClick={() => handleNumberClick('5')}
          className="aspect-square bg-gray-700 text-white text-xl font-medium rounded-lg
                   hover:bg-gray-600 active:scale-95 transition-all"
        >
          5
        </button>
        <button
          onClick={() => handleNumberClick('6')}
          className="aspect-square bg-gray-700 text-white text-xl font-medium rounded-lg
                   hover:bg-gray-600 active:scale-95 transition-all"
        >
          6
        </button>
        <button
          onClick={() => handleOperationClick('*')}
          className="aspect-square bg-orange-500 text-white text-xl font-medium rounded-lg
                   hover:bg-orange-600 active:scale-95 transition-all"
        >
          ×
        </button>

        <button
          onClick={() => handleNumberClick('1')}
          className="aspect-square bg-gray-700 text-white text-xl font-medium rounded-lg
                   hover:bg-gray-600 active:scale-95 transition-all"
        >
          1
        </button>
        <button
          onClick={() => handleNumberClick('2')}
          className="aspect-square bg-gray-700 text-white text-xl font-medium rounded-lg
                   hover:bg-gray-600 active:scale-95 transition-all"
        >
          2
        </button>
        <button
          onClick={() => handleNumberClick('3')}
          className="aspect-square bg-gray-700 text-white text-xl font-medium rounded-lg
                   hover:bg-gray-600 active:scale-95 transition-all"
        >
          3
        </button>
        <button
          onClick={() => handleOperationClick('-')}
          className="aspect-square bg-orange-500 text-white text-xl font-medium rounded-lg
                   hover:bg-orange-600 active:scale-95 transition-all"
        >
          −
        </button>

        <button
          onClick={() => handleNumberClick('0')}
          className="aspect-square bg-gray-700 text-white text-xl font-medium rounded-lg
                   hover:bg-gray-600 active:scale-95 transition-all"
        >
          0
        </button>
        <button
          onClick={handleDecimal}
          className="aspect-square bg-gray-700 text-white text-xl font-medium rounded-lg
                   hover:bg-gray-600 active:scale-95 transition-all"
        >
          .
        </button>
        <button
          onClick={handleBackspace}
          className="aspect-square bg-gray-600 text-white text-xl font-medium rounded-lg
                   hover:bg-gray-500 active:scale-95 transition-all flex items-center justify-center"
        >
          <Delete size={20} />
        </button>
        <button
          onClick={() => handleOperationClick('+')}
          className="aspect-square bg-orange-500 text-white text-xl font-medium rounded-lg
                   hover:bg-orange-600 active:scale-95 transition-all"
        >
          +
        </button>

        <button
          onClick={handleClear}
          className="col-span-2 bg-red-500 text-white text-lg font-medium rounded-lg
                   hover:bg-red-600 active:scale-95 transition-all py-3"
        >
          Clear
        </button>
        <button
          onClick={() => handleOperationClick('=')}
          className="col-span-2 bg-blue-500 text-white text-xl font-medium rounded-lg
                   hover:bg-blue-600 active:scale-95 transition-all"
        >
          =
        </button>
      </div>
    </div>
  );
}
