<?php

namespace Leyer\TranslationAdditionBundle\Model;

/**
 * Class TranslationUpdaterInterface
 *
 * @package Leyer\TranslationAdditionBundle\Model
 */
interface TranslationUpdaterInterface
{
    /**
     * @param $id
     * @param $value
     * @param $domain
     * @param $locale
     *
     * @return null
     */
    public function update($id, $value, $domain, $locale);
}