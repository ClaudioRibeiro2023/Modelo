import type { Meta, StoryObj } from '@storybook/react'
import { MoreVertical } from 'lucide-react'
import { Card, CardHeader, CardFooter } from './Card'
import { Button } from '../Button/Button'

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['elevated', 'outlined', 'filled'],
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'This is a card with some content.',
  },
}

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    children: 'Elevated card with shadow.',
  },
}

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    children: 'Outlined card with border.',
  },
}

export const Filled: Story = {
  args: {
    variant: 'filled',
    children: 'Filled card with background.',
  },
}

export const Interactive: Story = {
  args: {
    interactive: true,
    children: 'Click me! I have hover effects.',
  },
}

export const WithHeader: Story = {
  render: () => (
    <Card
      header={
        <CardHeader
          title="Card Title"
          subtitle="This is a subtitle"
          action={<button style={{ background: 'none', border: 'none', cursor: 'pointer' }}><MoreVertical size={16} /></button>}
        />
      }
    >
      <p>Card body content goes here.</p>
    </Card>
  ),
}

export const WithFooter: Story = {
  render: () => (
    <Card
      footer={
        <CardFooter>
          <Button variant="ghost" size="sm">Cancel</Button>
          <Button size="sm">Save</Button>
        </CardFooter>
      }
    >
      <p>Card with footer actions.</p>
    </Card>
  ),
}

export const Complete: Story = {
  render: () => (
    <Card
      header={
        <CardHeader
          title="User Profile"
          subtitle="Manage your account settings"
        />
      }
      footer={
        <CardFooter>
          <Button variant="ghost" size="sm">Cancel</Button>
          <Button size="sm">Save Changes</Button>
        </CardFooter>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <p>This is a complete card with header, body, and footer.</p>
        <p>You can add any content here.</p>
      </div>
    </Card>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
      <Card variant="elevated">
        <strong>Elevated</strong>
        <p>With shadow</p>
      </Card>
      <Card variant="outlined">
        <strong>Outlined</strong>
        <p>With border</p>
      </Card>
      <Card variant="filled">
        <strong>Filled</strong>
        <p>With background</p>
      </Card>
    </div>
  ),
}
