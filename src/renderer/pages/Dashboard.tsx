import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Streamer, PlatformType } from '../../common/types';
import StreamerList from '../components/StreamerList';

interface DashboardProps {
  streamers: {[key in PlatformType]?: Streamer[]};
}

const Dashboard: React.FC<DashboardProps> = ({ streamers }) => {
  const [liveStreamers, setLiveStreamers] = useState<Streamer[]>([]);
  const [loading, setLoading] = useState(false);
  
  // 从所有平台提取正在直播的主播
  useEffect(() => {
    const allLiveStreamers: Streamer[] = [];
    
    Object.values(streamers).forEach(platformStreamers => {
      if (platformStreamers) {
        const liveOnes = platformStreamers.filter(streamer => streamer.isLive);
        allLiveStreamers.push(...liveOnes);
      }
    });
    
    // 按观看人数排序
    allLiveStreamers.sort((a, b) => {
      const countA = a.viewerCount || 0;
      const countB = b.viewerCount || 0;
      return countB - countA;
    });
    
    setLiveStreamers(allLiveStreamers);
  }, [streamers]);

  const refreshAllPlatforms = async () => {
    setLoading(true);
    const platforms: PlatformType[] = ['douyu', 'bilibili', 'huya', 'douyin'];
    
    try {
      await Promise.all(platforms.map(async platform => {
        try {
          await window.electron.getFollowingList(platform);
        } catch (error) {
          console.error(`刷新${platform}失败`, error);
        }
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>直播状态监控</h1>
        <button 
          className="refresh-button"
          onClick={refreshAllPlatforms}
          disabled={loading}
        >
          {loading ? '刷新中...' : '刷新所有平台'}
        </button>
      </div>
      
      <div className="dashboard-summary">
        <div className="summary-card">
          <h3>正在直播</h3>
          <div className="summary-count">{liveStreamers.length}</div>
        </div>
        
        <div className="summary-card">
          <h3>关注总数</h3>
          <div className="summary-count">
            {Object.values(streamers).reduce((total, list) => total + (list?.length || 0), 0)}
          </div>
        </div>
        
        <div className="platform-links">
          {['douyu', 'bilibili', 'huya', 'douyin'].map(platform => (
            <Link 
              key={platform} 
              to={`/platform/${platform}`}
              className="platform-link"
            >
              {platform === 'douyu' ? '斗鱼' : 
               platform === 'bilibili' ? 'B站' : 
               platform === 'huya' ? '虎牙' : '抖音'}
              <span className="count">
                {streamers[platform as PlatformType]?.filter(s => s.isLive).length || 0}
              </span>
            </Link>
          ))}
        </div>
      </div>
      
      <div className="live-streamers-section">
        <h2>正在直播 ({liveStreamers.length})</h2>
        <StreamerList streamers={liveStreamers} loading={loading} />
      </div>
    </div>
  );
};

export default Dashboard;