import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { AboutPage } from '../about';
import { IndexPage } from '../index';

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();

jest.mock('@granite-js/react-native', () => ({
  createRoute: jest.fn(() => ({
    useNavigation: () => ({
      navigate: mockNavigate,
      goBack: mockGoBack,
    }),
  })),
}));

jest.mock('@toss/tds-react-native', () => {
  const React = require('react');
  const { Pressable, Text: NativeText, View } = require('react-native');

  return {
    Button: ({
      children,
      onPress,
    }: {
      children?: React.ReactNode;
      onPress?: () => void;
    }) =>
      React.createElement(
        Pressable,
        {
          accessibilityRole: 'button',
          onPress,
        },
        React.createElement(NativeText, null, children),
      ),
    Text: ({
      children,
      ...props
    }: {
      children?: React.ReactNode;
      [key: string]: unknown;
    }) => React.createElement(NativeText, props, children),
    TDSProvider: ({ children }: { children?: React.ReactNode }) =>
      React.createElement(View, null, children),
  };
});

describe('starter page smoke tests', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockGoBack.mockReset();
  });

  it('renders the home screen and navigates to the checklist page', () => {
    render(<IndexPage />);

    expect(screen.getByText('Apps in Toss RN Starter')).toBeOnTheScreen();
    expect(screen.getByText('설정 체크리스트 보기')).toBeOnTheScreen();

    fireEvent.press(screen.getByText('설정 체크리스트 보기'));

    expect(mockNavigate).toHaveBeenCalledWith('/about');
  });

  it('renders the checklist page and supports going back', () => {
    render(<AboutPage />);

    expect(screen.getByText('배포 전 확인')).toBeOnTheScreen();
    expect(
      screen.getByText('1. 콘솔 appName과 granite.config.ts 값 일치'),
    ).toBeOnTheScreen();

    fireEvent.press(screen.getByText('홈으로 돌아가기'));

    expect(mockGoBack).toHaveBeenCalled();
  });
});
