import type { Meta, StoryObj } from '@storybook/react'
import { Skeleton, SkeletonText, SkeletonAvatar, SkeletonCard, SkeletonTable } from './Skeleton'

const meta: Meta<typeof Skeleton> = {
  title: 'Components/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['text', 'circular', 'rectangular', 'rounded'],
    },
    animation: {
      control: 'select',
      options: ['pulse', 'wave', 'none'],
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    width: 200,
    height: 20,
  },
}

export const Text: Story = {
  args: {
    variant: 'text',
    width: 200,
  },
}

export const Circular: Story = {
  args: {
    variant: 'circular',
    width: 50,
    height: 50,
  },
}

export const Rectangular: Story = {
  args: {
    variant: 'rectangular',
    width: 200,
    height: 100,
  },
}

export const WaveAnimation: Story = {
  args: {
    variant: 'rectangular',
    width: 200,
    height: 100,
    animation: 'wave',
  },
}

export const NoAnimation: Story = {
  args: {
    variant: 'rectangular',
    width: 200,
    height: 100,
    animation: 'none',
  },
}

export const TextBlock: Story = {
  render: () => <SkeletonText lines={4} />,
  parameters: { layout: 'padded' },
}

export const Avatar: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <SkeletonAvatar size={32} />
      <SkeletonAvatar size={48} />
      <SkeletonAvatar size={64} />
    </div>
  ),
}

export const CardSkeleton: Story = {
  render: () => <SkeletonCard />,
  decorators: [(Story) => <div style={{ width: '300px' }}><Story /></div>],
}

export const TableSkeleton: Story = {
  render: () => <SkeletonTable rows={5} columns={4} />,
  decorators: [(Story) => <div style={{ width: '600px' }}><Story /></div>],
}

export const UserCard: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem', background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <SkeletonAvatar size={48} />
      <div style={{ flex: 1 }}>
        <Skeleton variant="text" width="60%" height={16} />
        <div style={{ height: '8px' }} />
        <Skeleton variant="text" width="40%" height={14} />
      </div>
    </div>
  ),
}
