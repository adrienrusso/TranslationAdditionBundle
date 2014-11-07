<?php

namespace Leyer\TranslationAdditionBundle\Controller;

use Leyer\TranslationAdditionBundle\Model\TranslationUpdaterInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Translation\TranslatorInterface;

/**
 * Class TranslatorController
 *
 * @package Leyer\TranslationAdditionBundle\Controller
 */
class TranslatorController
{
    /**
     * @var TranslationUpdaterInterface
     */
    protected $updater;

    /**
     * @var TranslatorInterface
     */
    protected $translator;

    /**
     * @param TranslationUpdaterInterface $updater
     * @param TranslatorInterface         $translator
     */
    public function __construct(TranslationUpdaterInterface $updater, TranslatorInterface $translator)
    {
        $this->updater    = $updater;
        $this->translator = $translator;
    }

    /**
     * @param Request $request
     * @param string  $domain
     * @param string  $locale
     *
     * @return Response
     */
    public function messageAction(Request $request, $domain, $locale)
    {
        try {
            $this->updater->update(
                $id = $request->get('id'),
                $request->get('message'),
                $domain,
                $locale
            );

            return new JsonResponse([
                'message' => $this->translator->trans($id, $request->get('parameters') ?: [], $domain, $locale)
            ]);
        } catch (\Exception $e) {

            return new JsonResponse(
                [
                    'code'    => $e->getCode(),
                    'message' => $e->getMessage()
                ],
                500
            );
        }
    }
}
