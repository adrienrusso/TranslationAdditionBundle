<?php

namespace Leyer\TranslationAdditionBundle\DependencyInjection;

use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\Config\FileLocator;
use Symfony\Component\HttpKernel\DependencyInjection\Extension;
use Symfony\Component\DependencyInjection\Loader;

/**
 * This is the class that loads and manages your bundle configuration
 *
 * To learn more see {@link http://symfony.com/doc/current/cookbook/bundles/extension.html}
 */
class LeyerTranslationAdditionExtension extends Extension
{
    /**
     * {@inheritDoc}
     */
    public function load(array $configs, ContainerBuilder $container)
    {
        $configuration = new Configuration();
        $config = $this->processConfiguration($configuration, $configs);

        $loader = new Loader\YamlFileLoader($container, new FileLocator(__DIR__.'/../Resources/config'));

        if (isset($config['inline_translation'])) {
            $loader->load('services/twig.yml');
            $loader->load('services/controller.yml');

            if ($config['inline_translation']['updater'] == 'jms_updater') {
                $loader->load('services/jms.yml');
            } else {
                $container->addAliases([
                    'leyer.updater' => $config['updater']
                ]);
            }
        }
    }
}
