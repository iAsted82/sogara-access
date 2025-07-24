import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { VisitorRegistrationForm } from './VisitorRegistrationForm';
import { AppointmentVerificationPanel } from './AppointmentVerificationPanel';
import { appointmentsData } from '../../data/appointmentsData';

// Mock functions
const mockRegisterVisitor = jest.fn();
const mockAppointmentSelected = jest.fn();

describe('Visitor Registration Form', () => {
  // Reset mocks before each test
  beforeEach(() => {
    mockRegisterVisitor.mockReset();
    mockAppointmentSelected.mockReset();
  });

  test('renders the form with all required fields', () => {
    render(
      <VisitorRegistrationForm 
        appointments={appointmentsData}
        onRegisterVisitor={mockRegisterVisitor}
        onAppointmentSelected={mockAppointmentSelected}
      />
    );
    
    // Check for required fields
    expect(screen.getByLabelText(/prénom/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nom/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/téléphone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/motif de visite/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/service concerné/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/personne à rencontrer/i)).toBeInTheDocument();
  });

  test('submits the form with entered data', async () => {
    render(
      <VisitorRegistrationForm 
        appointments={appointmentsData}
        onRegisterVisitor={mockRegisterVisitor}
        onAppointmentSelected={mockAppointmentSelected}
      />
    );
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/prénom/i), { target: { value: 'Jean' } });
    fireEvent.change(screen.getByLabelText(/nom/i), { target: { value: 'DUPONT' } });
    fireEvent.change(screen.getByLabelText(/téléphone/i), { target: { value: '+241 01 23 45 67' } });
    fireEvent.change(screen.getByLabelText(/motif de visite/i), { target: { value: 'Demande CNI' } });
    
    // Select a service
    const serviceSelect = screen.getByLabelText(/service concerné/i);
    fireEvent.change(serviceSelect, { target: { value: 'Documentation' } });
    
    // Add person to visit
    fireEvent.change(screen.getByLabelText(/personne à rencontrer/i), { target: { value: 'Marie AKUE' } });
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /enregistrer/i });
    fireEvent.click(submitButton);
    
    // Check if register function was called
    await waitFor(() => {
      expect(mockRegisterVisitor).toHaveBeenCalledTimes(1);
      const formData = mockRegisterVisitor.mock.calls[0][0];
      expect(formData.firstName).toBe('Jean');
      expect(formData.lastName).toBe('DUPONT');
      expect(formData.serviceRequested).toBe('Documentation');
    });
  });

  test('pre-fills form when a visitor has an appointment', async () => {
    // Render the form
    const { rerender } = render(
      <VisitorRegistrationForm 
        appointments={appointmentsData}
        onRegisterVisitor={mockRegisterVisitor}
        onAppointmentSelected={mockAppointmentSelected}
      />
    );
    
    // Enter a name that matches an appointment
    const firstNameInput = screen.getByLabelText(/prénom/i);
    const lastNameInput = screen.getByLabelText(/nom/i);
    
    fireEvent.change(firstNameInput, { target: { value: 'Paul' } });
    fireEvent.change(lastNameInput, { target: { value: 'OBIANG' } });
    
    // The form should show appointment section and call onAppointmentSelected
    await waitFor(() => {
      expect(mockAppointmentSelected).toHaveBeenCalledTimes(1);
    });
    
    // Re-render with the selected appointment
    rerender(
      <VisitorRegistrationForm 
        appointments={appointmentsData}
        onRegisterVisitor={mockRegisterVisitor}
        onAppointmentSelected={mockAppointmentSelected}
      />
    );
    
    // Check that form fields have been pre-filled from the appointment
    await waitFor(() => {
      expect(screen.getByLabelText(/motif de visite/i).value).toBe('Renouvellement passeport');
      expect(screen.getByLabelText(/service concerné/i).value).toBe('Passeports');
    });
  });
});

describe('Appointment Verification Panel', () => {
  test('shows message when no appointment is found', () => {
    render(
      <AppointmentVerificationPanel
        appointments={appointmentsData}
        visitorName="Unknown Visitor"
        onAppointmentSelected={mockAppointmentSelected}
      />
    );
    
    expect(screen.getByText(/aucun rendez-vous trouvé/i)).toBeInTheDocument();
  });

  test('displays appointment details when match is found', () => {
    render(
      <AppointmentVerificationPanel
        appointments={appointmentsData}
        visitorName="Paul OBIANG"
        phoneNumber="+241 02 34 56 78"
        onAppointmentSelected={mockAppointmentSelected}
      />
    );
    
    expect(screen.getByText(/rendez-vous vérifié/i)).toBeInTheDocument();
    expect(screen.getByText(/renouvellement passeport/i)).toBeInTheDocument();
  });

  test('allows selection between multiple possible matches', async () => {
    render(
      <AppointmentVerificationPanel
        appointments={appointmentsData}
        visitorName="Marie" // Partial match that could return multiple results
        onAppointmentSelected={mockAppointmentSelected}
      />
    );
    
    // Should show partial match message
    expect(screen.getByText(/correspondance possible/i)).toBeInTheDocument();
    
    // Select an appointment
    const useButton = screen.getAllByText(/utiliser ce rendez-vous/i)[0];
    fireEvent.click(useButton);
    
    // Should call the appointment selected handler
    expect(mockAppointmentSelected).toHaveBeenCalledTimes(1);
  });
});