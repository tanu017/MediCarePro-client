# Components Structure

This directory contains all the React components for the MediCarePro application. The components have been organized for better maintainability and reusability.

## Navigation Components

### Header.jsx
- **Purpose**: Main header component with logo and authentication buttons
- **Props**: 
  - `isDrawerOpen`: Boolean to control mobile drawer state
  - `setIsDrawerOpen`: Function to toggle mobile drawer
- **Features**: 
  - Responsive design
  - Authentication state handling
  - Mobile menu button

### DesktopSidebar.jsx
- **Purpose**: Collapsible sidebar for desktop users
- **Props**:
  - `onLogoutClick`: Function to handle logout button click
- **Features**:
  - Hover to expand functionality
  - Role-based navigation items
  - User profile section
  - Logout button

### MobileDrawer.jsx
- **Purpose**: Mobile navigation drawer
- **Props**:
  - `isOpen`: Boolean to control drawer visibility
  - `onClose`: Function to close the drawer
  - `onLogoutClick`: Function to handle logout
- **Features**:
  - Full-screen mobile navigation
  - Backdrop overlay
  - Role-based navigation items

### Navigation.jsx
- **Purpose**: Main navigation component that combines all navigation elements
- **Features**:
  - Manages state for drawer and logout dialog
  - Handles logout logic
  - Renders Header, DesktopSidebar, MobileDrawer, and LogoutConfirmationModal

## Modal Components

### LogoutConfirmationModal.jsx
- **Purpose**: Confirmation dialog for logout action
- **Props**:
  - `isOpen`: Boolean to control modal visibility
  - `onConfirm`: Function to handle logout confirmation
  - `onCancel`: Function to handle logout cancellation
- **Features**:
  - Centered modal with backdrop
  - Confirmation and cancel buttons

### AppointmentConfirmationModal.jsx
- **Purpose**: Confirmation modal for successful appointment booking
- **Props**:
  - `isOpen`: Boolean to control modal visibility
  - `onConfirm`: Function to handle confirmation
  - `appointmentDetails`: Object containing appointment information
- **Features**:
  - Displays appointment details
  - Success animation
  - Reusable for both patient and receptionist booking

## Appointment Components

### BookAppointmentModal.jsx
- **Purpose**: Unified modal for booking appointments (both patient and receptionist modes)
- **Props**:
  - `isOpen`: Boolean to control modal visibility
  - `onClose`: Function to close the modal
  - `onAppointmentBooked`: Callback when appointment is successfully booked
  - `userRole`: String indicating the user role ('PATIENT' or 'RECEPTIONIST')
- **Features**:
  - **Patient Mode**: Simple doctor selection grid, uses logged-in user as patient
  - **Receptionist Mode**: Patient and doctor search functionality, can book for any patient
  - Date and time selection
  - Payment processing
  - Uses AppointmentConfirmationModal for confirmation
  - Role-based rendering and API calls

## Common Components

### common/
Contains reusable UI components:
- `AnimatedBackground.jsx`
- `FormInput.jsx`
- `MobileLogo.jsx`
- `SecurityNotice.jsx`
- `StatsDisplay.jsx`
- `TrustBadge.jsx`
- `TrustIndicators.jsx`

## Usage

The main Navigation component should be used in the App.jsx file:

```jsx
import Navigation from './components/Navigation';

// In your App component
<Navigation />
```

This will render the complete navigation system including header, sidebar, drawer, and all modals.
