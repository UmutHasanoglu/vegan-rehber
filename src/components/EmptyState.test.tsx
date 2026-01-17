import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import EmptyState from './EmptyState';

describe('EmptyState', () => {
  it('should render default search empty state', () => {
    render(<EmptyState type="search" />);

    expect(screen.getByText('Sonuç bulunamadı')).toBeInTheDocument();
  });

  it('should render favorites empty state', () => {
    render(<EmptyState type="favorites" />);

    expect(screen.getByText('Favori ürününüz yok')).toBeInTheDocument();
  });

  it('should render products empty state', () => {
    render(<EmptyState type="products" />);

    expect(screen.getByText('Ürün bulunamadı')).toBeInTheDocument();
  });

  it('should render error state', () => {
    render(<EmptyState type="error" />);

    expect(screen.getByText('Bir hata oluştu')).toBeInTheDocument();
  });

  it('should render custom title and description', () => {
    render(
      <EmptyState
        type="search"
        title="Custom Title"
        description="Custom Description"
      />
    );

    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom Description')).toBeInTheDocument();
  });

  it('should render action button when provided', () => {
    render(
      <EmptyState
        type="search"
        action={<button>Click me</button>}
      />
    );

    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
