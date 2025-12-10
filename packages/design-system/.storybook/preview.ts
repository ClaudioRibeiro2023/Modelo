import type { Preview } from '@storybook/react'

// Import global styles
import '../src/styles/storybook.css'

// Import component styles
import '../src/components/Button/Button.css'
import '../src/components/Input/Input.css'
import '../src/components/Card/Card.css'
import '../src/components/Modal/Modal.css'
import '../src/components/Toast/Toast.css'
import '../src/components/Tabs/Tabs.css'
import '../src/components/Table/Table.css'
import '../src/components/Dropdown/Dropdown.css'
import '../src/components/Skeleton/Skeleton.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#F8FAFC' },
        { name: 'dark', value: '#0F172A' },
        { name: 'white', value: '#FFFFFF' },
      ],
    },
    layout: 'centered',
  },
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        showName: true,
      },
    },
  },
}

export default preview
