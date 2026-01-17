import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useForm } from './useForm';

describe('useForm', () => {
  const mockOnSubmit = vi.fn();

  const defaultOptions = {
    initialValues: { name: '', email: '' },
    onSubmit: mockOnSubmit,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useForm(defaultOptions));

    expect(result.current.values).toEqual({ name: '', email: '' });
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
  });

  it('should update values on change', () => {
    const { result } = renderHook(() => useForm(defaultOptions));

    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'John', type: 'text' },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.values.name).toBe('John');
  });

  it('should mark field as touched on blur', () => {
    const { result } = renderHook(() => useForm(defaultOptions));

    act(() => {
      result.current.handleBlur({
        target: { name: 'name' },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.touched.name).toBe(true);
  });

  it('should validate on submit', async () => {
    const validate = vi.fn().mockReturnValue({ name: 'Required' });
    const { result } = renderHook(() =>
      useForm({ ...defaultOptions, validate })
    );

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>);
    });

    expect(result.current.errors.name).toBe('Required');
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should call onSubmit when validation passes', async () => {
    const validate = vi.fn().mockReturnValue({});
    const { result } = renderHook(() =>
      useForm({ ...defaultOptions, validate })
    );

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>);
    });

    expect(mockOnSubmit).toHaveBeenCalledWith({ name: '', email: '' });
  });

  it('should reset form', () => {
    const { result } = renderHook(() => useForm(defaultOptions));

    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'John', type: 'text' },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.values.name).toBe('John');

    act(() => {
      result.current.reset();
    });

    expect(result.current.values.name).toBe('');
  });

  it('should set field value programmatically', () => {
    const { result } = renderHook(() => useForm(defaultOptions));

    act(() => {
      result.current.setFieldValue('name', 'Jane');
    });

    expect(result.current.values.name).toBe('Jane');
  });

  it('should set field error programmatically', () => {
    const { result } = renderHook(() => useForm(defaultOptions));

    act(() => {
      result.current.setFieldError('email', 'Invalid email');
    });

    expect(result.current.errors.email).toBe('Invalid email');
  });
});
