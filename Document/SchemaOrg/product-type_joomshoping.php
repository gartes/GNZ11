<?php
    /***********************************************************************************************************************
     * ╔═══╗ ╔══╗ ╔═══╗ ╔════╗ ╔═══╗ ╔══╗  ╔╗╔╗╔╗ ╔═══╗ ╔══╗   ╔══╗  ╔═══╗ ╔╗╔╗ ╔═══╗ ╔╗   ╔══╗ ╔═══╗ ╔╗  ╔╗ ╔═══╗ ╔╗ ╔╗ ╔════╗
     * ║╔══╝ ║╔╗║ ║╔═╗║ ╚═╗╔═╝ ║╔══╝ ║╔═╝  ║║║║║║ ║╔══╝ ║╔╗║   ║╔╗╚╗ ║╔══╝ ║║║║ ║╔══╝ ║║   ║╔╗║ ║╔═╗║ ║║  ║║ ║╔══╝ ║╚═╝║ ╚═╗╔═╝
     * ║║╔═╗ ║╚╝║ ║╚═╝║   ║║   ║╚══╗ ║╚═╗  ║║║║║║ ║╚══╗ ║╚╝╚╗  ║║╚╗║ ║╚══╗ ║║║║ ║╚══╗ ║║   ║║║║ ║╚═╝║ ║╚╗╔╝║ ║╚══╗ ║╔╗ ║   ║║
     * ║║╚╗║ ║╔╗║ ║╔╗╔╝   ║║   ║╔══╝ ╚═╗║  ║║║║║║ ║╔══╝ ║╔═╗║  ║║─║║ ║╔══╝ ║╚╝║ ║╔══╝ ║║   ║║║║ ║╔══╝ ║╔╗╔╗║ ║╔══╝ ║║╚╗║   ║║
     * ║╚═╝║ ║║║║ ║║║║    ║║   ║╚══╗ ╔═╝║  ║╚╝╚╝║ ║╚══╗ ║╚═╝║  ║╚═╝║ ║╚══╗ ╚╗╔╝ ║╚══╗ ║╚═╗ ║╚╝║ ║║    ║║╚╝║║ ║╚══╗ ║║ ║║   ║║
     * ╚═══╝ ╚╝╚╝ ╚╝╚╝    ╚╝   ╚═══╝ ╚══╝  ╚═╝╚═╝ ╚═══╝ ╚═══╝  ╚═══╝ ╚═══╝  ╚╝  ╚═══╝ ╚══╝ ╚══╝ ╚╝    ╚╝  ╚╝ ╚═══╝ ╚╝ ╚╝   ╚╝
     *----------------------------------------------------------------------------------------------------------------------
     *
     * @author     Gartes | sad.net79@gmail.com | Skype : agroparknew | Telegram : @gartes
     * @date       24.11.2020 03:18
     * @copyright  Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
     * @license    GNU General Public License version 2 or later;
     **********************************************************************************************************************/
    defined('_JEXEC') or die; // No direct access to this file

    /* @var $displayData array */
    /* @var $self object */


    extract($displayData);

    # Микроразметка application/ld+json -> "@type":"Product"
    $doc = \Joomla\CMS\Factory::getDocument();
    $replaceArr = [
        '/\n/'=>' ',
        '/\r/'=>' ',
        '/\t/'=>' ',
        '/;&nbsp;/'=>' ',
        '/\s+/'=>' ',
        '/\s+,/'=>',',
    ];
    $url = $doc->getBase();
    $email = 'sales@pro-spec.ru' ;
    # Самая низкая оценка в вашей шкале.
    $worstRating = 0;
    $bestRating = 10;


    $self->product->name = $self->product->seoname ? $self->product->seoname : $self->product->name ;
    $description = preg_replace( array_keys( $replaceArr ) , $replaceArr , $self->product->description);

    require JPATH_LIBRARIES . '/Spatie/vendor/autoload.php';

    use Spatie\SchemaOrg\OfferItemCondition;
    use Spatie\SchemaOrg\Schema;


    $aggregateRating = Schema::aggregateRating();

    $aggregateRating->setProperty('bestRating', $bestRating );


    $reviewCount = 0 ;
    if( isset($self->reviews) )
    {
        $reviewCount = count($self->reviews);
    }#END IF

    /**
     * Общее количество оценок элемента на вашем сайте.
     * Необходимо использовать либо ratingCount, либо reviewCount.
     */
    $aggregateRating->setProperty('reviewCount', $reviewCount );
    /**
     * Самая низкая оценка в вашей шкале.
     * Если значение worstRating не указано, по умолчанию оно равно 1.
     */
    $aggregateRating->setProperty('worstRating', $worstRating );





    $arrReview = [];
    $allMark = 0 ;
    foreach ( $self->reviews as $review)
    {
        $allMark += $review->mark ;

        $Review = Schema::Review();
        $Review->setProperty('name' , $self->product->name );
        $Review->setProperty('reviewBody' , $review->review );

        $Person = Schema::Person();
        $Person->setProperty('name' , $review->user_name );
        $Review->setProperty('author' , $Person );


        $reviewRating = Schema::Rating();
        $reviewRating->setProperty('worstRating' , $worstRating );
        $reviewRating->setProperty('bestRating' , $bestRating );
        $reviewRating->setProperty('ratingValue' , $review->mark );

        $Review->setProperty('reviewRating' , $reviewRating );


        $arrReview[] = $Review;
    }#END FOREACH

    $ratingValue = 0 ;
    if( $allMark )
    {
        $count = count( $self->reviews );
        $ratingValue = $allMark/$count ;
    }#END IF

    /**
     * Оценка, выраженная простым числом, дробью или процентом (например, "4", "60 %" или "6/10").
     * Система распознает шкалы для дробей и процентов, так как шкала предусмотрена непосредственно в дроби
     * или проценте. По умолчанию используется 5-балльная шкала,
     * где 5 – это самая высокая оценка, а 1 – самая низкая. Чтобы выбрать другую шкалу,
     * задайте свойства bestRating и worstRating.
     */
    $aggregateRating->setProperty('ratingValue', $ratingValue );

//     echo'<pre>';print_r( $ratingValue );echo'</pre>'.__FILE__.' '.__LINE__ . PHP_EOL;
//    die(__FILE__ .' '. __LINE__ );


    $schemaProduct = Schema::Product()
        ->sku( $self->product->product_ean )
        ->mpn( $self->product->product_ean )
        ->url( $url )
        ->name( $self->product->name )
        ->image( $self->image_product_path . '/' . $self->images[0]->image_name )
        ->description( strip_tags ( $description ) )
        ->itemCondition(  OfferItemCondition::NewCondition )
        ->offers(  Schema::offer()
            ->name( $self->product->name )
            ->url( $url )
            ->price(  $self->product->getPriceCalculate()  )
            ->priceCurrency('RUB')
            ->availability( Spatie\SchemaOrg\ItemAvailability::InStock )
            //            ->priceValidUntil( (new \DateTime())->format(\DateTime::ISO8601) )
            ->priceValidUntil( $self->product->date_modify )
        )
        ->aggregateRating($aggregateRating)
        ->review($arrReview)
    ;


    if( $self->product->manufacturer_info->name )
    {
        $manufacturerLink = SEFLink('index.php?option=com_jshopping&controller=manufacturer&task=view&manufacturer_id='
            . $self->product->manufacturer_info->id , 2);

        # add to schemaProduct
        $schemaProduct->brand(
            Schema::Brand()
                ->name( $self->product->manufacturer_info->name )
                ->url($manufacturerLink)
        );
    }#END IF


    echo $schemaProduct->toScript();



