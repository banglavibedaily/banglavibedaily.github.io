import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Featured from '../Featured.jsx';
import LatestVideos from '../LatestVideos.jsx';

const video = {
  id: 'ccccccccccc',
  title: 'Top 5 AI tools in Bangla',
  published: '2026-09-07T00:00:00Z',
  views: 1200,
};

it('renders nothing when there are no featured videos', () => {
  const { container } = render(<Featured videos={[]} />);
  expect(container).toBeEmptyDOMElement();
});

it('shows the coming-soon panel when there are no latest videos', () => {
  render(<LatestVideos videos={[]} updatedAt="2026-09-12T00:30:00Z" />);
  expect(screen.getByText(/coming soon/i)).toBeInTheDocument();
  expect(screen.getAllByRole('link', { name: /subscribe/i }).length).toBeGreaterThan(0);
});

it('shows video cards with date and views', () => {
  render(<LatestVideos videos={[video]} updatedAt="2026-09-12T00:30:00Z" />);
  expect(screen.getByText(video.title)).toBeInTheDocument();
  expect(screen.getByText(/1\.2K views/)).toBeInTheDocument();
  expect(screen.getByRole('img', { name: video.title })).toHaveAttribute(
    'src',
    'https://i.ytimg.com/vi/ccccccccccc/hqdefault.jpg'
  );
});

it('opens and closes the player', async () => {
  render(<LatestVideos videos={[video]} updatedAt="2026-09-12T00:30:00Z" />);

  await userEvent.click(screen.getByRole('link', { name: new RegExp(video.title, 'i') }));

  const dialog = screen.getByRole('dialog');
  expect(dialog).toHaveAttribute('aria-modal', 'true');
  expect(document.querySelector('iframe')).toHaveAttribute(
    'src',
    'https://www.youtube-nocookie.com/embed/ccccccccccc?autoplay=1'
  );

  await userEvent.keyboard('{Escape}');
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});
