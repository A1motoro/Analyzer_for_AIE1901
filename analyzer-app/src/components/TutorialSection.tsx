import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const TutorialSection: React.FC = () => {
  const { t } = useTranslation();
  const [activeTopic, setActiveTopic] = useState('basic');

  // 教程内容
  const tutorialContents: { [key: string]: any } = {
    basic: {
      title: t('tutorialSection.basic.title'),
      content: [
        {
          subtitle: t('tutorialSection.basic.dataInput.subtitle'),
          items: [
            t('tutorialSection.basic.dataInput.item1'),
            t('tutorialSection.basic.dataInput.item2'),
            t('tutorialSection.basic.dataInput.item3')
          ]
        },
        {
          subtitle: t('tutorialSection.basic.analysis.subtitle'),
          items: [
            t('tutorialSection.basic.analysis.item1'),
            t('tutorialSection.basic.analysis.item2'),
            t('tutorialSection.basic.analysis.item3')
          ]
        },
        {
          subtitle: t('tutorialSection.basic.export.subtitle'),
          items: [
            t('tutorialSection.basic.export.item1'),
            t('tutorialSection.basic.export.item2')
          ]
        }
      ]
    },
    advanced: {
      title: t('tutorialSection.advanced.title'),
      content: [
        {
          subtitle: t('tutorialSection.advanced.indicators.subtitle'),
          items: [
            t('tutorialSection.advanced.indicators.item1'),
            t('tutorialSection.advanced.indicators.item2'),
            t('tutorialSection.advanced.indicators.item3'),
            t('tutorialSection.advanced.indicators.item4'),
            t('tutorialSection.advanced.indicators.item5')
          ]
        },
        {
          subtitle: t('tutorialSection.advanced.distributions.subtitle'),
          items: [
            t('tutorialSection.advanced.distributions.item1'),
            t('tutorialSection.advanced.distributions.item2'),
            t('tutorialSection.advanced.distributions.item3'),
            t('tutorialSection.advanced.distributions.item4')
          ]
        },
        {
          subtitle: t('tutorialSection.advanced.estimation.subtitle'),
          items: [
            t('tutorialSection.advanced.estimation.item1'),
            t('tutorialSection.advanced.estimation.item2')
          ]
        }
      ]
    },
    model: {
      title: t('tutorialSection.model.title'),
      content: [
        {
          subtitle: t('tutorialSection.model.config.subtitle'),
          items: [
            t('tutorialSection.model.config.item1'),
            t('tutorialSection.model.config.item2'),
            t('tutorialSection.model.config.item3')
          ]
        },
        {
          subtitle: t('tutorialSection.model.tips.subtitle'),
          items: [
            t('tutorialSection.model.tips.item1'),
            t('tutorialSection.model.tips.item2'),
            t('tutorialSection.model.tips.item3')
          ]
        },
        {
          subtitle: t('tutorialSection.model.faq.subtitle'),
          items: [
            t('tutorialSection.model.faq.item1'),
            t('tutorialSection.model.faq.item2'),
            t('tutorialSection.model.faq.item3')
          ]
        }
      ]
    },
    troubleshooting: {
      title: t('tutorialSection.troubleshooting.title'),
      content: [
        {
          subtitle: t('tutorialSection.troubleshooting.upload.subtitle'),
          items: [
            t('tutorialSection.troubleshooting.upload.item1'),
            t('tutorialSection.troubleshooting.upload.item2'),
            t('tutorialSection.troubleshooting.upload.item3')
          ]
        },
        {
          subtitle: t('tutorialSection.troubleshooting.results.subtitle'),
          items: [
            t('tutorialSection.troubleshooting.results.item1'),
            t('tutorialSection.troubleshooting.results.item2'),
            t('tutorialSection.troubleshooting.results.item3')
          ]
        },
        {
          subtitle: t('tutorialSection.troubleshooting.performance.subtitle'),
          items: [
            t('tutorialSection.troubleshooting.performance.item1'),
            t('tutorialSection.troubleshooting.performance.item2'),
            t('tutorialSection.troubleshooting.performance.item3')
          ]
        }
      ]
    }
  };

  const currentTopic = tutorialContents[activeTopic];

  return (
    <section className="tutorial-section bg-white rounded-xl shadow-card p-6 mb-12 transition-all-300 hover:shadow-card-hover animate-slide-up">
      <h2 className="text-xl font-bold mb-6">{t('tutorialSection.title')}</h2>

      {/* 教程主题导航 */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(tutorialContents).map(([key, topic]) => (
          <button
            key={key}
            onClick={() => setActiveTopic(key)}
            className={`px-4 py-2 rounded-lg transition-all-300 ${
              activeTopic === key
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {topic.title}
          </button>
        ))}
      </div>

      {/* 教程内容 */}
      <div className="space-y-6">
        {currentTopic.content.map((section: any, index: number) => (
          <div key={index} className="bg-gray-50 rounded-lg p-5">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              {section.subtitle}
            </h3>
            <ul className="space-y-2">
              {section.items.map((item: string, itemIndex: number) => (
                <li key={itemIndex} className="flex items-start">
                  <i className="fa fa-check-circle text-primary mt-1 mr-2 flex-shrink-0"></i>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TutorialSection;
