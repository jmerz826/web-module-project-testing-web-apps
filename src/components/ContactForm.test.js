import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContactForm from './ContactForm';

test('renders without errors', () => {
    //**************************sanity check**************************
    // expect(1).toBe(2); 
    render(<ContactForm />);
});

test('renders the contact form header', ()=> {
    render(<ContactForm />);
    const header = screen.queryByText(/Contact form/i);

    //THREE ASSERTS
    //1. header is in the document
    expect(header).toBeInTheDocument();
    //2. header is truthy
    expect(header).toBeTruthy();
    //3. header has correct text content
    expect(header).toHaveTextContent(/contact form/i);
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm />);
    const firstNameInput = screen.queryByPlaceholderText(/edd/i);

    userEvent.type(firstNameInput, 'John');

    await waitFor(() => {
        const firstNameError = screen.queryByText('Error: firstName must have at least 5 characters.')
        expect(firstNameError).toBeInTheDocument();
    })
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm />);

    const submitButton = screen.queryByText(/submit/i);

    userEvent.click(submitButton);

    await waitFor(() => {
        const firstNameError = screen.queryByText('Error: firstName must have at least 5 characters.');
        const lastNameError = screen.queryByText('Error: lastName is a required field.');
        const emailError = screen.queryByText('Error: email must be a valid email address.');

        expect(firstNameError).toBeInTheDocument();
        expect(lastNameError).toBeInTheDocument();
        expect(emailError).toBeInTheDocument();
    });
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm />);

    //define submit button
    const submitButton = screen.queryByText(/submit/i);

    // Type proper value into first name input
    const firstNameInput = screen.queryByPlaceholderText(/edd/i);
    userEvent.type(firstNameInput, 'Warren');

    // Type proper value into last name input
    const lastNameInput = screen.queryByPlaceholderText(/Burke/i);
    userEvent.type(lastNameInput, 'Warren');

    // Click submit button
    userEvent.click(submitButton);

    await waitFor(() => {
        const firstNameError = screen.queryByText('Error: firstName must have at least 5 characters.');
        const lastNameError = screen.queryByText('Error: lastName is a required field.');
        const emailError = screen.queryByText('Error: email must be a valid email address.');

        // Only error message to appear should be the email one
        expect(firstNameError).not.toBeInTheDocument();
        expect(lastNameError).not.toBeInTheDocument();
        expect(emailError).toBeInTheDocument();
    });
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm />);

    const emailInput = screen.queryByLabelText(/email*/i);
    // console.log(emailInput);
    userEvent.type(emailInput, 'a');

    await waitFor(() => {
        const firstNameError = screen.queryByText('Error: firstName must have at least 5 characters.');
        const lastNameError = screen.queryByText('Error: lastName is a required field.');
        const emailError = screen.queryByText('Error: email must be a valid email address.');

        // Only error message to appear should be the email one
        expect(firstNameError).not.toBeInTheDocument();
        expect(lastNameError).not.toBeInTheDocument();
        expect(emailError).toBeInTheDocument();
    })
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm />);

    //define submit button
    const submitButton = screen.queryByText(/submit/i);

    // Type proper value into first name input
    const firstNameInput = screen.queryByPlaceholderText(/edd/i);
    userEvent.type(firstNameInput, 'Warren');

    // Type proper value into email input
    const emailInput = screen.queryByLabelText(/email*/i);
    userEvent.type(emailInput, 'john@test.com');

    userEvent.click(submitButton);

    await waitFor(() => {
        const lastNameError = screen.queryByText('Error: lastName is a required field.');
        expect(lastNameError).toBeInTheDocument();
    })
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm />);

    //define submit button
    const submitButton = screen.queryByText(/submit/i);

    // Type proper value into first name input
    const firstNameInput = screen.queryByPlaceholderText(/edd/i);
    userEvent.type(firstNameInput, 'Warren');

    // Type proper value into email input
    const emailInput = screen.queryByLabelText(/email*/i);
    userEvent.type(emailInput, 'john@test.com');

    // Type proper value into last name input
    const lastNameInput = screen.queryByPlaceholderText(/Burke/i);
    userEvent.type(lastNameInput, 'Merz');

    userEvent.click(submitButton);

    await waitFor(() => {
        const firstNameSubmitted = screen.queryByTestId('firstnameDisplay');
        expect(firstNameSubmitted).toBeInTheDocument();

        const lastNameSubmitted = screen.queryByTestId('lastnameDisplay');
        expect(lastNameSubmitted).toBeInTheDocument();

        const emailSubmitted = screen.queryByTestId('emailDisplay');
        expect(emailSubmitted).toBeInTheDocument();

        const messageSubmitted = screen.queryByTestId('messageDisplay');
        expect(messageSubmitted).not.toBeInTheDocument();
    })
});

test('renders all fields text when all fields are submitted.', async () => {
});