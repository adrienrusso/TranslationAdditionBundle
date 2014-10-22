<?php

namespace Leyer\TranslationAdditionBundle\Translation;

use JMS\TranslationBundle\Model\Message;
use JMS\TranslationBundle\Translation\ConfigFactory;
use JMS\TranslationBundle\Translation\FileWriter;
use JMS\TranslationBundle\Translation\LoaderManager;
use JMS\TranslationBundle\Translation\Updater;
use JMS\TranslationBundle\Util\FileUtils;
use Leyer\TranslationAdditionBundle\Model\TranslationUpdaterInterface;

/**
 * Class JMSUpdaterAdapter
 *
 * @package Leyer\TranslationAdditionBundle\Translation
 */
class JMSUpdaterAdapter implements TranslationUpdaterInterface
{
    /**
     * @var \JMS\TranslationBundle\Translation\Updater
     */
    protected $updater;

    /**
     * @var \JMS\TranslationBundle\Translation\ConfigFactory
     */
    protected $configFactory;

    /**
     * @var \JMS\TranslationBundle\Translation\FileWriter
     */
    protected $writer;

    /**
     * @var \JMS\TranslationBundle\Translation\LoaderManager
     */
    protected $loader;

    /**
     * @param Updater       $updater
     * @param ConfigFactory $configFactory
     * @param FileWriter    $writer
     * @param LoaderManager $loader
     */
    public function __construct(Updater $updater, ConfigFactory $configFactory, FileWriter $writer, LoaderManager $loader)
    {
        $this->updater       = $updater;
        $this->configFactory = $configFactory;
        $this->writer        = $writer;
        $this->loader        = $loader;
    }

    /**
     * @param $id
     * @param $value
     * @param $domain
     * @param $locale
     *
     * @return null
     *
     * @throws \RuntimeException
     */
    public function update($id, $value, $domain, $locale)
    {
        $files = $this->getFiles($domain, $locale);

        if (is_null($files)) {
            throw new \RuntimeException(
                sprintf('There is no translation file for domain "%s" and locale "%s".', $domain, $locale)
            );
        }

        list($format, $file) = $files;

        $catalogue = $this->loader->loadFile($file, $format, $locale, $domain);
        $message = new Message($id, $domain);
        if (!$catalogue->has($message)) {
            $message->setLocaleString($value);
            $catalogue->add($message);

            $this->writer->write($catalogue, $domain, $file, $format);
        }

        $this->updater->updateTranslation($file, $format, $domain, $locale, $id,$value);
    }

    /**
     * @param $domain
     * @param $locale
     *
     * @return array|null
     */
    public function getFiles($domain, $locale)
    {
        foreach ($this->configFactory->getNames() as $config) {
            $translationsDir = $this->configFactory->getConfig($config, 'en')->getTranslationsDir();
            $files = FileUtils::findTranslationFiles($translationsDir);
            if (isset($files[$domain][$locale])) {
                return $files[$domain][$locale];
            }
        }
    }
}