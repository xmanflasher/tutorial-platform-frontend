import { render, screen } from '@testing-library/react';
import CourseList from '../components/CourseList';

jest.mock('swr', () => ({
    __esModule: true,
    default: (key) => {
        return { data: { courses: [{ id: '1', title: 'T1', author: 'A', description: 'D', image: '/img' }] } }
    }
}));

test('renders course list', () => {
    render(<CourseList />);
    expect(screen.getByText(/T1/)).toBeInTheDocument();
});
