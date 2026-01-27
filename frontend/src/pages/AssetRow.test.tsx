import { render, screen, fireEvent } from '@testing-library/react';
import AssetRow from './AssetRow';
import { vi } from 'vitest';

type Asset = {
  id: string;
  assetId?: string;
  name: string;
  tags: string[]; // not optional
  status?: string;
  rawKey?: string;
  thumbnailKey?: string;
  createdAt?: string;
  variants?: Record<string, { key: string; contentType?: string }>;
};

vi.mock('../utils/minio', async () => {
  const actual = await vi.importActual<typeof import('../utils/minio')>('../utils/minio');
  return {
    ...actual,
    MINIO_PUBLIC_URL: '',
    MINIO_BUCKET_NAME: '',
    getThumbnailUrl: () => '',
    getFilename: () => 'Test Asset',
  };
});

describe('AssetRow', () => {
  const asset: Asset = {
    id: '1',
    assetId: '1',
    name: 'Test Asset',
    tags: ['image', 'summer'],
    status: 'processed',
    rawKey: 'raw-key',
    thumbnailKey: 'thumb-key',
    createdAt: '2026-01-27T12:00:00Z',
    variants: { original: { key: 'original-key' }, small: { key: 'small-key' } },
  };

  it('renders asset info and tags', () => {
    render(
      <table>
        <tbody>
          <AssetRow asset={asset} selected={false} onSelect={vi.fn()} onPreview={vi.fn()} />
        </tbody>
      </table>,
    );
    expect(screen.getByText('Test Asset')).toBeInTheDocument();
    expect(screen.getByText('image')).toBeInTheDocument();
    expect(screen.getByText('summer')).toBeInTheDocument();
    expect(screen.getByText('processed')).toBeInTheDocument();
  });

  it('calls onSelect when checkbox is clicked', () => {
    const onSelect = vi.fn();
    render(
      <table>
        <tbody>
          <AssetRow asset={asset} selected={false} onSelect={onSelect} onPreview={vi.fn()} />
        </tbody>
      </table>,
    );
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onSelect).toHaveBeenCalledWith('1');
  });

  it('calls onPreview when preview button is clicked', () => {
    const onPreview = vi.fn();
    render(
      <table>
        <tbody>
          <AssetRow asset={asset} selected={false} onSelect={vi.fn()} onPreview={onPreview} />
        </tbody>
      </table>,
    );
    fireEvent.click(screen.getByLabelText('Preview original'));
    expect(onPreview).toHaveBeenCalledWith(asset, 'original');
  });
});
